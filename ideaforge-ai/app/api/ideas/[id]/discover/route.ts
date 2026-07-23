import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
});

interface ExaResult {
  title: string;
  url: string;
  publishedDate: string | null;
  author: string | null;
  highlight: string;
  text: string;
  source: string;
}

interface PainPoint {
  quote: string;
  source: string;
  url: string;
  platform: string;
  sentiment: "frustrated" | "seeking" | "angry" | "curious";
}

interface DemandSignal {
  signal: string;
  evidence: string;
  strength: "strong" | "moderate" | "weak";
  sourceCount: number;
}

interface CompetitorMention {
  name: string;
  context: string;
  sentiment: "positive" | "negative" | "neutral";
  frequency: number;
  url: string;
}

interface DiscoveryResult {
  painPoints: PainPoint[];
  demandSignals: DemandSignal[];
  competitorMentions: CompetitorMention[];
  suggestedOutreach: string[];
  rawSources: { title: string; url: string; snippet: string; platform: string }[];
  summary: string;
}

function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("reddit.com")) return "Reddit";
  if (lower.includes("news.ycombinator.com") || lower.includes("ycombinator")) return "Hacker News";
  if (lower.includes("producthunt.com")) return "Product Hunt";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "X/Twitter";
  if (lower.includes("stackoverflow.com") || lower.includes("stackexchange.com")) return "Stack Overflow";
  if (lower.includes("dev.to") || lower.includes("hashnode") || lower.includes("medium.com")) return "Blog/Dev";
  if (lower.includes("quora.com")) return "Quora";
  return "Web";
}

function extractJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      /* continue */
    }
  }
  const braceStart = text.indexOf("{");
  if (braceStart === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = braceStart; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0)
        return JSON.parse(text.slice(braceStart, i + 1));
    }
  }
  try {
    return JSON.parse(text.slice(braceStart));
  } catch {
    return null;
  }
}

async function searchExa(
  query: string,
  numResults: number = 10
): Promise<ExaResult[]> {
  const exaKey = process.env.EXA_API_KEY;
  if (!exaKey) return [];

  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": exaKey,
      },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults,
        livecrawl: "preferred",
        includeDomains: [
          "reddit.com",
          "news.ycombinator.com",
          "producthunt.com",
          "twitter.com",
          "x.com",
          "stackoverflow.com",
          "dev.to",
          "medium.com",
        ],
      }),
    });

    if (!res.ok) {
      console.error("Exa search failed:", res.status);
      return [];
    }

    const data = await res.json();
    const results = data.results || [];

    return results.map((r: Record<string, unknown>) => ({
      title: String(r.title || ""),
      url: String(r.url || ""),
      publishedDate: r.publishedDate ? String(r.publishedDate) : null,
      author: r.author ? String(r.author) : null,
      highlight: String(r.highlight || ""),
      text: String(r.text || r.snippet || ""),
      source: String(r.url || ""),
    }));
  } catch (err: unknown) {
    console.error("Exa search error:", err instanceof Error ? err.message : "unknown error");
    return [];
  }
}

const ANALYSIS_PROMPT = `You are an expert customer discovery analyst for IdeaForge AI. Your job is to analyze real conversations from Reddit, Hacker News, Product Hunt, X/Twitter, and other platforms to extract actionable customer insights for a startup idea.

Given a startup idea and real search results from these platforms, analyze the data and return a structured JSON response.

Your analysis must be grounded in the ACTUAL search results provided. Do not fabricate data. Every pain point, demand signal, and competitor mention must come from a real source in the results.

Return JSON in this exact format:
{
  "painPoints": [
    {
      "quote": "<exact or close paraphrase of what a real person said>",
      "source": "<author or username if available, otherwise title of the post>",
      "url": "<actual URL from the search results>",
      "platform": "<Reddit|Hacker News|Product Hunt|X/Twitter|Stack Overflow|Blog|Web>",
      "sentiment": "<frustrated|seeking|angry|curious>"
    }
  ],
  "demandSignals": [
    {
      "signal": "<e.g. 'Users actively seeking this solution' or 'High engagement on related threads'>",
      "evidence": "<specific evidence from the search results>",
      "strength": "<strong|moderate|weak>",
      "sourceCount": <number of search results supporting this signal>
    }
  ],
  "competitorMentions": [
    {
      "name": "<competitor or alternative tool name>",
      "context": "<what people say about it>",
      "sentiment": "<positive|negative|neutral>",
      "frequency": <number of times mentioned in results>,
      "url": "<best URL reference>"
    }
  ],
  "suggestedOutreach": [
    "<3 distinct outreach message templates for reaching out to potential customers for discovery interviews. Each should be personalized, reference the pain point, and ask open-ended questions. Keep each under 200 words.>"
  ],
  "summary": "<2-3 sentence executive summary of the customer discovery findings>"
}

Rules:
- Extract ALL pain points from the provided search results (aim for 5-8 if available)
- Every pain point must have a REAL URL from the search results
- Only mention competitors that were actually named in the search results
- Outreach messages should feel human, not salesy
- If search results are sparse, acknowledge limited data honestly in the summary`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserId(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`discover:${userId}:${ip}`, {
    windowMs: 3600000,
    maxRequests: 3,
  });
  if (!rl.allowed) {
    return Response.json(
      {
        error: `Rate limit exceeded. Try again in ${Math.ceil(rl.resetIn / 60)} minutes.`,
        resetIn: rl.resetIn,
      },
      { status: 429 }
    );
  }

  const { id: ideaId } = await params;

  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId },
  });
  if (!idea) {
    return Response.json({ error: "Idea not found" }, { status: 404 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(data: object) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      }

      try {
        sendEvent({
          type: "progress",
          step: "search-reddit",
          label: "Scanning Reddit for pain points",
          progress: 10,
        });

        const problemQuery = idea.description
          .slice(0, 200)
          .replace(/[<>]/g, "");
        const safeTitle = idea.title.replace(/[<>]/g, "").slice(0, 100);

        const [redditResults, hnResults, phResults, twitterResults, forumResults] =
          await Promise.all([
            searchExa(
              `${safeTitle} site:reddit.com frustrated need help ${problemQuery}`,
              8
            ),
            searchExa(
              `${safeTitle} site:news.ycombinator.com ${problemQuery}`,
              6
            ),
            searchExa(
              `${safeTitle} site:producthunt.com ${problemQuery}`,
              5
            ),
            searchExa(
              `${safeTitle} (site:twitter.com OR site:x.com) ${problemQuery}`,
              6
            ),
            searchExa(
              `${safeTitle} ${problemQuery} problem frustrated alternative`,
              8
            ),
          ]);

        sendEvent({
          type: "progress",
          step: "search-complete",
          label: `Found ${redditResults.length + hnResults.length + phResults.length + twitterResults.length + forumResults.length} results across platforms`,
          progress: 30,
        });

        const allResults = [
          ...redditResults,
          ...hnResults,
          ...phResults,
          ...twitterResults,
          ...forumResults,
        ];

        const rawSources = allResults.map((r) => ({
          title: r.title,
          url: r.url,
          snippet: (r.highlight || r.text || "").slice(0, 300),
          platform: detectPlatform(r.url),
        }));

        const searchContext = allResults
          .map(
            (r, i) =>
              `[${i + 1}] ${r.title}\nPlatform: ${detectPlatform(r.url)}\nURL: ${r.url}\n${r.highlight || r.text || ""}`
          )
          .join("\n\n");

        sendEvent({
          type: "progress",
          step: "analyze",
          label: "AI analyzing conversations for pain points & demand signals",
          progress: 50,
        });

        const aiResponse = await client.chat.completions.create({
          model: process.env.AI_MODEL || "openai/gpt-4o",
          messages: [
            { role: "system", content: ANALYSIS_PROMPT },
            {
              role: "user",
              content: `Startup Idea: "${idea.title}"
Description: ${idea.description.slice(0, 500)}
${idea.targetAudience ? `Target Audience: ${idea.targetAudience}` : ""}
${idea.industry ? `Industry: ${idea.industry}` : ""}

Search Results from Reddit, HN, Product Hunt, X/Twitter, and forums:

${searchContext || "No results found across platforms."}

Analyze these results for customer discovery insights.`,
            },
          ],
          temperature: 0.5,
          max_tokens: 4000,
        });

        const aiContent = aiResponse.choices[0]?.message?.content || "";
        const parsed = extractJson(aiContent);

        sendEvent({
          type: "progress",
          step: "synthesize",
          label: "Cross-referencing insights and generating outreach templates",
          progress: 80,
        });

        let result: DiscoveryResult;

        if (parsed) {
          const painPoints: PainPoint[] = Array.isArray(parsed.painPoints)
            ? parsed.painPoints
                .slice(0, 10)
                .map((p: Record<string, unknown>) => ({
                  quote: String(p.quote || ""),
                  source: String(p.source || ""),
                  url: String(p.url || ""),
                  platform: String(p.platform || "Web"),
                  sentiment: (["frustrated", "seeking", "angry", "curious"].includes(
                    String(p.sentiment)
                  )
                    ? p.sentiment
                    : "seeking") as PainPoint["sentiment"],
                }))
            : [];

          const demandSignals: DemandSignal[] = Array.isArray(
            parsed.demandSignals
          )
            ? parsed.demandSignals
                .slice(0, 6)
                .map((d: Record<string, unknown>) => ({
                  signal: String(d.signal || ""),
                  evidence: String(d.evidence || ""),
                  strength: (["strong", "moderate", "weak"].includes(
                    String(d.strength)
                  )
                    ? d.strength
                    : "moderate") as DemandSignal["strength"],
                  sourceCount: Number(d.sourceCount) || 0,
                }))
            : [];

          const competitorMentions: CompetitorMention[] = Array.isArray(
            parsed.competitorMentions
          )
            ? parsed.competitorMentions
                .slice(0, 8)
                .map((c: Record<string, unknown>) => ({
                  name: String(c.name || ""),
                  context: String(c.context || ""),
                  sentiment: (["positive", "negative", "neutral"].includes(
                    String(c.sentiment)
                  )
                    ? c.sentiment
                    : "neutral") as CompetitorMention["sentiment"],
                  frequency: Number(c.frequency) || 1,
                  url: String(c.url || rawSources[0]?.url || ""),
                }))
            : [];

          const suggestedOutreach: string[] = Array.isArray(
            parsed.suggestedOutreach
          )
            ? parsed.suggestedOutreach.slice(0, 3).map(String)
            : [];

          result = {
            painPoints,
            demandSignals,
            competitorMentions,
            suggestedOutreach,
            rawSources: rawSources.slice(0, 20),
            summary: String(
              parsed.summary || "Analysis complete."
            ),
          };
        } else {
          const fallbackPainPoints: PainPoint[] = rawSources
            .filter((s) => s.snippet.length > 20)
            .slice(0, 5)
            .map((s) => ({
              quote: s.snippet.slice(0, 200),
              source: s.title,
              url: s.url,
              platform: s.platform,
              sentiment: "seeking" as const,
            }));

          result = {
            painPoints: fallbackPainPoints,
            demandSignals: [
              {
                signal: "Activity found across multiple platforms",
                evidence: `Found relevant discussions on ${[...new Set(rawSources.map((s) => s.platform))].join(", ")}`,
                strength: rawSources.length > 10 ? "strong" : "moderate",
                sourceCount: rawSources.length,
              },
            ],
            competitorMentions: [],
            rawSources: rawSources.slice(0, 20),
            suggestedOutreach: [
              `Hi! I noticed you were discussing challenges related to "${idea.title}". I'm exploring a potential solution in this space and would love to hear more about your experience. Would you be open to a 15-minute chat about what you've tried so far?`,
              `Hey there - I saw your post about the challenges with [specific problem]. I'm doing some customer research and your perspective would be incredibly valuable. No pitch, just trying to understand the problem better. Mind if I ask you a few questions?`,
              `I came across your discussion about this problem and it resonated with an idea I'm developing. Would love to get your unfiltered take - what would the ideal solution look like for you? Happy to share what I learn with the community too.`,
            ],
            summary: `Found ${rawSources.length} relevant discussions across ${[...new Set(rawSources.map((s) => s.platform))].length} platforms. ${rawSources.length > 5 ? "Strong signal of active discussion around this problem space." : "Limited but promising discussions found - further research recommended."}`,
          };
        }

        sendEvent({
          type: "progress",
          step: "complete",
          label: "Customer discovery analysis complete",
          progress: 100,
        });

        sendEvent({ type: "complete", result });
      } catch (err: unknown) {
        console.error(
          `Customer discovery failed for idea ${ideaId}:`,
          err instanceof Error ? err.message : "unknown error"
        );
        sendEvent({
          type: "error",
          message: "Customer discovery analysis failed. Please try again.",
        });
      }

      controller.close();
    },
    cancel() {
      // Client disconnected
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
