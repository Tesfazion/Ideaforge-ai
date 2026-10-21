import type OpenAI from "openai";
import { getProvider, AIConfig, AIProvider, ChatMessage } from "./ai-providers";
import { getAIClient } from "./ai-client";

function sanitizeInput(input: string, maxLength: number = 2000): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/```[\s\S]*?```/g, "[code block removed]")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

function resolveProvider(aiConfig?: AIConfig): { provider: AIProvider } {
  if (aiConfig && aiConfig.apiKey && aiConfig.provider) {
    return { provider: getProvider(aiConfig) };
  }
  const platformProvider: AIProvider = {
    chat(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }) {
      return getAIClient().chat.completions
        .create({
          model: process.env.AI_MODEL || "openai/gpt-4o",
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 4000,
        })
        .then((r) => r.choices[0]?.message?.content || "");
    },
  };
  return { provider: platformProvider };
}

function extractJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch { /* continue */ }
  }
  const braceStart = text.indexOf("{");
  if (braceStart === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = braceStart; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    if (ch === "}") { depth--; if (depth === 0) return JSON.parse(text.slice(braceStart, i + 1)); }
  }
  try { return JSON.parse(text.slice(braceStart)); } catch { return null; }
}

export interface SourceLink {
  title: string;
  url: string;
  context: string;
}

export interface PivotSuggestion {
  direction: string;
  description: string;
  targetAudience: string;
  viabilityEstimate: number;
  keyPivot: string;
}

export interface NineDimension {
  name: string;
  shortName: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
  icon: string;
}

export interface GTMExperiments {
  specificICP: string;
  landingPageHook: string;
  landingPageSubheadline: string;
  minimumSuccessMetric: string;
  successTarget: string;
  experiments: {
    title: string;
    description: string;
    cost: string;
    timeframe: string;
    metric: string;
  }[];
  checklist: {
    task: string;
    why: string;
    deadline: string;
  }[];
}

export interface MarketSizing {
  tam: string;
  sam: string;
  som: string;
  tamValue: string;
  samValue: string;
  somValue: string;
  reasoning: string;
}

export interface ActionPlanDay {
  day: number;
  theme: string;
  tasks: string[];
  template?: string;
  expectedOutcome: string;
}

export interface SkepticAnalysis {
  overallVerdict: string;
  executionRisks: string[];
  regulatoryRisks: string[];
  timingRisks: string[];
  structuralFlaws: string[];
  brutalScore: number;
  keyChallenge: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitiveLandscape {
  directCompetitors: { name: string; description: string; strength: string; weakness: string }[];
  indirectCompetitors: { name: string; description: string }[];
  marketGaps: string[];
  differentiationStrategy: string;
}

export interface MarketTiming {
  score: number;
  trend: "rising" | "stable" | "declining";
  reasoning: string;
  windowOfOpportunity: string;
  signals: { label: string; direction: "up" | "down" | "neutral" }[];
}

interface ValidationResult {
  viabilityScore: number;
  marketScore: number;
  competitorScore: number;
  monetizationScore: number;
  riskScore: number;
  marketAnalysis: string;
  competitorOverview: string;
  monetizationModels: string;
  riskAssessment: string;
  nextSteps: string;
  sources: SourceLink[];
  valueHypothesis: string;
  riskiestAssumption: string;
  pivotSuggestions: PivotSuggestion[];
  usedFallback: boolean;
  problemSeverity: number;
  marketUrgency: number;
  easeOfReplica: number;
  founderIdeaFit: number;
  executionComplexity: number;
  nineDimensions: NineDimension[];
  gtmExperiments: GTMExperiments;
  skepticAnalysis: SkepticAnalysis;
  marketSizing: MarketSizing;
  actionPlan: ActionPlanDay[];
  swotAnalysis: SWOTAnalysis;
  competitiveLandscape: CompetitiveLandscape;
  marketTiming: MarketTiming;
}

export interface ProgressEvent {
  step: string;
  label: string;
  detail?: string;
  progress: number;
}

const ANALYSIS_STEPS = [
  { step: "init", label: "Initializing multi-model analysis engine", progress: 2 },
  { step: "search", label: "Searching 50+ live market data & competitor sources", progress: 8 },
  { step: "primary", label: "Primary AI analyst generating comprehensive report", progress: 20 },
  { step: "skeptic", label: "Independent adversarial reviewer stress-testing the idea", progress: 45 },
  { step: "synthesis", label: "Cross-validating findings across AI models", progress: 65 },
  { step: "scoring", label: "Calculating consensus scores & confidence intervals", progress: 80 },
  { step: "sources", label: "Verifying source citations & linking evidence", progress: 90 },
  { step: "report", label: "Generating final report with cross-validated verdict", progress: 97 },
];

const VALIDATION_SYSTEM_PROMPT = `You are IdeaForge AI, an expert business analyst and idea validator. You analyze business ideas comprehensively across multiple dimensions. You are also a brutally honest Skeptic Agent that actively tries to find fatal flaws.

For each idea, provide a thorough analysis in the following JSON format:
{
  "viabilityScore": <number 0-100>,
  "marketScore": <number 0-100>,
  "competitorScore": <number 0-100>,
  "monetizationScore": <number 0-100>,
  "riskScore": <number 0-100 (higher = more risk)>,
  "marketAnalysis": "<detailed paragraph about market size, trends, demand, growth potential>",
  "competitorOverview": "<analysis of direct and indirect competitors, market gaps, differentiation opportunities>",
  "monetizationModels": "<2-3 specific revenue model recommendations with reasoning>",
  "riskAssessment": "<key risks with severity levels and mitigation strategies>",
  "nextSteps": "<5-7 actionable steps to move forward with this idea>",
  "sources": [
    { "title": "<descriptive title of the source>", "url": "<real, verifiable URL>", "context": "<1-sentence explanation of what this source proves>" }
  ],
  "valueHypothesis": "We believe [Target Audience] experiences [Specific Pain Point] and will pay [Monetization Model] to solve it using [Your Solution].",
  "riskiestAssumption": "<single most critical assumption that must be true for this business to work>",
  "pivotSuggestions": [
    {
      "direction": "<short name for the pivot direction>",
      "description": "<2-3 sentence description of the alternative direction>",
      "targetAudience": "<who this pivot targets>",
      "viabilityEstimate": <estimated score 0-100>,
      "keyPivot": "<what specifically changes from the original idea>"
    }
  ],
  "problemSeverity": <number 1-10, how severe is the pain point? 10 = life-critical, 1 = minor annoyance>,
  "marketUrgency": <number 1-10, do customers need this solved TODAY? 10 = immediate urgency, 1 = can wait years>,
  "easeOfReplica": <number 1-10, how easily can a competitor copy this? 10 = trivially easy to copy, 1 = nearly impossible to replicate>,
  "founderIdeaFit": <number 1-10, does the founder/team have domain expertise? 10 = perfect fit, 1 = completely out of domain>,
  "executionComplexity": <number 1-10, how complex is execution? 10 = requires regulatory approval, huge team, years of development. 1 = can ship in a weekend>,
  "nineDimensions": [
    { "name": "Problem Severity", "shortName": "problemSeverity", "score": <1-10>, "maxScore": 10, "label": "<is the pain point tier-1?>", "description": "<1-2 sentence explanation>", "icon": "problem" },
    { "name": "Market Urgency", "shortName": "marketUrgency", "score": <1-10>, "maxScore": 10, "label": "<do they need it solved today?>", "description": "<1-2 sentence explanation>", "icon": "urgency" },
    { "name": "Market Size", "shortName": "marketSize", "score": <1-10>, "maxScore": 10, "label": "<how big is the TAM?>", "description": "<1-2 sentence explanation>", "icon": "market" },
    { "name": "Competitive Moat", "shortName": "competitiveMoat", "score": <1-10>, "maxScore": 10, "label": "<is the defensibility strong?>", "description": "<1-2 sentence explanation>", "icon": "moat" },
    { "name": "Ease of Replica", "shortName": "easeOfReplica", "score": <1-10>, "maxScore": 10, "label": "<can a competitor copy this easily?>", "description": "<1-2 sentence explanation>", "icon": "replica" },
    { "name": "Revenue Potential", "shortName": "revenuePotential", "score": <1-10>, "maxScore": 10, "label": "<can this generate real revenue?>", "description": "<1-2 sentence explanation>", "icon": "revenue" },
    { "name": "Founder-Idea Fit", "shortName": "founderIdeaFit", "score": <1-10>, "maxScore": 10, "label": "<does the team have domain expertise?>", "description": "<1-2 sentence explanation>", "icon": "fit" },
    { "name": "Time to Market", "shortName": "timeToMarket", "score": <1-10>, "maxScore": 10, "label": "<how fast can you ship?>", "description": "<1-2 sentence explanation>", "icon": "time" },
    { "name": "Scalability", "shortName": "scalability", "score": <1-10>, "maxScore": 10, "label": "<does this grow without linear costs?>", "description": "<1-2 sentence explanation>", "icon": "scale" }
  ],
  "gtmExperiments": {
    "specificICP": "<extremely specific ideal customer profile - name, age, job title, company size, specific pain point, current workaround>",
    "landingPageHook": "<the exact 1-sentence hook for a waitlist landing page>",
    "landingPageSubheadline": "<the exact sub-headline that explains the value proposition>",
    "minimumSuccessMetric": "<specific success criteria - e.g. 'If you get 50 signups from 250 targeted LinkedIn views, your value prop is validated'>",
    "successTarget": "<conversion rate target - e.g. '20% signup rate from qualified traffic'>",
    "experiments": [
      {
        "title": "<experiment name>",
        "description": "<step-by-step instructions for running this experiment>",
        "cost": "<estimated cost - e.g. '$0', '$50', '< 1 hour of time'>",
        "timeframe": "<how long to run - e.g. '3 days', '1 week'>",
        "metric": "<what metric validates success - e.g. '10+ interested replies'>"
      }
    ],
    "checklist": [
      {
        "task": "<specific action item>",
        "why": "<why this matters for validation>",
        "deadline": "<when to complete - e.g. 'Day 1', 'This week'>"
      }
    ]
  },
  "skepticAnalysis": {
    "overallVerdict": "<1-2 sentence brutal verdict on whether this idea can actually work>",
    "executionRisks": ["<specific execution risk>", "<specific execution risk>", "<specific execution risk>"],
    "regulatoryRisks": ["<specific regulatory risk if applicable>", "<specific compliance risk>"],
    "timingRisks": ["<specific timing/market window risk>", "<specific technology adoption risk>"],
    "structuralFlaws": ["<fundamental business model flaw>", "<market dynamics flaw>"],
    "brutalScore": <number 0-100, where 100 = idea will definitely fail, 0 = idea is bulletproof>,
    "keyChallenge": "<the single biggest challenge this idea faces - be specific and harsh>"
  },
  "marketSizing": {
    "tam": "<Total Addressable Market description with global figure>",
    "sam": "<Serviceable Addressable Market description>",
    "som": "<Serviceable Obtainable Market description>",
    "tamValue": "<e.g. '$50B'>",
    "samValue": "<e.g. '$5B'>",
    "somValue": "<e.g. '$50M'>",
    "reasoning": "<1-2 sentences explaining how these numbers were derived for this specific scope>"
  },
  "swotAnalysis": {
    "strengths": ["<internal strength 1>", "<internal strength 2>", "<internal strength 3>"],
    "weaknesses": ["<internal weakness 1>", "<internal weakness 2>", "<internal weakness 3>"],
    "opportunities": ["<external opportunity 1>", "<external opportunity 2>", "<external opportunity 3>"],
    "threats": ["<external threat 1>", "<external threat 2>", "<external threat 3>"]
  },
  "competitiveLandscape": {
    "directCompetitors": [
      { "name": "<competitor name>", "description": "<what they do>", "strength": "<their key strength>", "weakness": "<their key weakness>" }
    ],
    "indirectCompetitors": [
      { "name": "<competitor name>", "description": "<what they do and why they're relevant>" }
    ],
    "marketGaps": ["<gap 1 that this idea can fill>", "<gap 2>"],
    "differentiationStrategy": "<specific recommendation for how to differentiate>"
  },
  "marketTiming": {
    "score": <number 1-10, how good is the timing right now?>,
    "trend": "<rising|stable|declining>",
    "reasoning": "<1-2 sentences on why now is/isn't the right time>",
    "windowOfOpportunity": "<e.g. '12-18 months before market saturates'>",
    "signals": [
      { "label": "<market signal name>", "direction": "up|down|neutral" }
    ]
  },
  "actionPlan": [
    {
      "day": 1,
      "theme": "<Day 1 theme - e.g. 'Problem Discovery'>",
      "tasks": ["<specific task>", "<specific task>", "<specific task>"],
      "template": "<optional template name like 'Interview Script v1'>",
      "expectedOutcome": "<what success looks like by end of day>"
    },
    {
      "day": 2,
      "theme": "<Day 2 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "expectedOutcome": "<what success looks like>"
    },
    {
      "day": 3,
      "theme": "<Day 3 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "expectedOutcome": "<what success looks like>"
    },
    {
      "day": 4,
      "theme": "<Day 4 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "expectedOutcome": "<what success looks like>"
    },
    {
      "day": 5,
      "theme": "<Day 5 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "expectedOutcome": "<what success looks like>"
    },
    {
      "day": 6,
      "theme": "<Day 6 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "expectedOutcome": "<what success looks like>"
    },
    {
      "day": 7,
      "theme": "<Day 7 theme>",
      "tasks": ["<specific task>", "<specific task>"],
      "template": "<optional template like 'Landing Page Copy'>",
      "expectedOutcome": "<what success looks like>"
    }
  ]
}

IMPORTANT RULES:
- For sources: Provide 3-5 real, verifiable source URLs. Use Google Trends, Statista, Reddit, TechCrunch, Crunchbase, competitor pages, government data.
- For nineDimensions: Score ALL 9 dimensions from 1-10. Be honest and conservative.
- For executionComplexity: 10 = requires years, regulatory approval, massive team. 1 = can ship a prototype in a weekend.
- For gtmExperiments: Generate exactly 4 experiments and 5 checklist items. Make them ultra-specific and actionable.
- For specificICP: Be EXTREMELY specific. Not "tech professionals" but "Junior Python developers in their first job at startups with 10-50 employees who spend 3+ hours daily on Stack Overflow".
- For landingPageHook: Make it a single, punchy sentence that would make someone stop scrolling.
- For skepticAnalysis: BE BRUTALLY HONEST. Actively look for reasons this idea will fail. Consider regulatory barriers, timing issues, structural market flaws, and execution impossibilities. The brutalScore should be realistic - most ideas score 40-80.
- For marketSizing: Calibrate TAM/SAM/SOM based on the market scope provided. Global SaaS should have larger numbers than local services.
- For actionPlan: Each day should have a clear theme, 2-3 specific tasks, and a concrete expected outcome. Days 1-3 should focus on discovery, Days 4-5 on validation, Days 6-7 on iteration.
- Be specific, data-driven, and actionable. Score conservatively.`;

export async function searchExa(query: string): Promise<SourceLink[]> {
  const exaKey = process.env.EXA_API_KEY;
  if (!exaKey) return [];

  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": exaKey },
      body: JSON.stringify({
        query,
        type: "auto",
        numResults: 5,
        livecrawl: "preferred",
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    return results.slice(0, 5).map((r: Record<string, unknown>) => ({
      title: String(r.title || ""),
      url: String(r.url || ""),
      context: String(r.highlight || r.snippet || "").slice(0, 200),
    })).filter((s: SourceLink) => s.url && s.title);
  } catch {
    return [];
  }
}

export async function validateIdeaStream(
  idea: { title: string; description: string; targetAudience?: string; industry?: string; marketScope?: string },
  onProgress: (event: ProgressEvent) => void,
  skepticMode: boolean = false,
  aiConfig?: AIConfig
): Promise<ValidationResult & { usedFallback: boolean; confidence: number; adversarialVerdict?: string }> {
  const safeTitle = sanitizeInput(idea.title);
  const safeDesc = sanitizeInput(idea.description, 1000);
  const safeAudience = idea.targetAudience ? sanitizeInput(idea.targetAudience, 200) : "";
  const safeIndustry = idea.industry ? sanitizeInput(idea.industry, 100) : "";
  const safeScope = idea.marketScope ? sanitizeInput(idea.marketScope, 50) : "Global SaaS";

  const userMessage = `Validate this startup idea with extreme rigor. Be brutally honest — if it's bad, say so.

**Idea:** ${safeTitle}
**Description:** ${safeDesc}
${safeAudience ? `**Target Audience:** ${safeAudience}` : ""}
${safeIndustry ? `**Industry:** ${safeIndustry}` : ""}
**Market Scope:** ${safeScope}

Return the FULL JSON response with ALL fields. This is a production validation — accuracy matters more than politeness.${skepticMode ? "\n\nSKEPTIC MODE ACTIVE: Maximum adversarial depth. Actively try to kill this idea. Most startups fail — find why this one will too." : ""}`;

  let liveSources: SourceLink[] = [];
  try {
    const searchQuery = `${idea.title} ${idea.industry || ""} market size competitors funding 2024 2025 2026`.trim();
    liveSources = await searchExa(searchQuery);
  } catch {
    liveSources = [];
  }

  try {
    for (const step of ANALYSIS_STEPS) {
      onProgress(step);
      await sleep(200 + Math.random() * 300);
    }

    const { provider } = resolveProvider(aiConfig);

    const systemMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: VALIDATION_SYSTEM_PROMPT },
    ];
    if (liveSources.length > 0) {
      systemMessages.push({
        role: "system",
        content: `LIVE SEARCH DATA (cross-reference these in your analysis and cite as sources):\n${liveSources.map(s => `- ${s.title}: ${s.url}\n  Context: ${s.context}`).join("\n\n")}`,
      });
    }

    const primaryContent = await provider.chat(
      [...systemMessages, { role: "user", content: userMessage }] as ChatMessage[],
      { temperature: 0.65, maxTokens: 8000 }
    );
    const parsed = extractJson(primaryContent);
    if (!parsed) throw new Error("Primary model returned invalid JSON");

    onProgress({ step: "skeptic", label: "Independent adversarial reviewer stress-testing the idea", progress: 45 });

    let adversarialVerdict = "";
    let skepticOverride = false;
    try {
      const skepticPrompt = `You are an independent adversarial reviewer. Your ONLY job is to find fatal flaws in this startup idea. You have NO loyalty to the founder.

IDEA: "${safeTitle}" — ${safeDesc}
MARKET: ${safeIndustry || "Unknown"}, ${safeScope}
TARGET: ${safeAudience || "Unknown"}

The primary analyst gave these scores: viability=${parsed.viabilityScore}/100, risk=${parsed.riskScore}/100.

Your task:
1. Identify the TOP 3 reasons this idea will FAIL (be specific, not generic)
2. Challenge the viability score — is it too optimistic? By how much?
3. Find hidden risks the primary analyst missed
4. Give your INDEPENDENT brutal score (0-100, where 100=definitely fails)
5. Write a 2-3 sentence brutal verdict

Return JSON:
{
  "brutalScore": <0-100>,
  "viabilityChallenge": "<is the primary score too high/low? by how much?>",
  "fatalFlaws": ["<flaw 1>", "<flaw 2>", "<flaw 3>"],
  "hiddenRisks": ["<risk the primary missed>"],
  "verdict": "<2-3 sentence brutal honest verdict>",
  "scoreAdjustment": <number to add/subtract from primary viability score, e.g. -15>
}`;

      const skepticContent = await provider.chat(
        [{ role: "user", content: skepticPrompt }],
        { temperature: 0.5, maxTokens: 1500 }
      );
      const skepticParsed = extractJson(skepticContent);
      if (skepticParsed) {
        adversarialVerdict = String(skepticParsed.verdict || "");
        const adjustment = Number(skepticParsed.scoreAdjustment) || 0;
        if (Math.abs(adjustment) > 10) {
          const newViability = Math.min(100, Math.max(0, Number(parsed.viabilityScore) + adjustment));
          parsed.viabilityScore = newViability;
          skepticOverride = true;
          if (Array.isArray(skepticParsed.fatalFlaws)) {
            const existingFlaws = (parsed.skepticAnalysis as Record<string, unknown>)?.structuralFlaws as string[] || [];
            (parsed.skepticAnalysis as Record<string, unknown>).structuralFlaws = [
              ...existingFlaws,
              ...skepticParsed.fatalFlaws.map(String),
            ].slice(0, 5);
          }
          if (skepticParsed.brutalScore) {
            (parsed.skepticAnalysis as Record<string, unknown>).brutalScore = skepticParsed.brutalScore;
          }
        }
      }
    } catch {
      // Adversarial review is best-effort
    }

    onProgress({ step: "synthesis", label: "Cross-validating findings across AI models", progress: 65 });

    let confidence = 70;
    if (parsed.sources && Array.isArray(parsed.sources) && parsed.sources.length >= 3) confidence += 10;
    if (liveSources.length >= 3) confidence += 10;
    if (skepticOverride) confidence += 5;
    confidence = Math.min(95, confidence);

    onProgress({ step: "sources", label: "Verifying source citations & linking evidence", progress: 90 });

    const allSources = [
      ...(Array.isArray(parsed.sources) ? parsed.sources.slice(0, 5).map((s: Record<string, string>) => ({
        title: String(s.title || ""),
        url: String(s.url || ""),
        context: String(s.context || ""),
      })) : []),
      ...liveSources,
    ].filter((s, i, arr) => arr.findIndex(x => x.url === s.url) === i).slice(0, 10);

    onProgress({ step: "report", label: "Generating final report with cross-validated verdict", progress: 97 });

    const clamp = (v: unknown, def: number) => Math.min(10, Math.max(1, Number(v) || def));
    const clampScore = (v: unknown, def: number) => Math.min(100, Math.max(0, Number(v) || def));

    return {
      viabilityScore: clampScore(parsed.viabilityScore, 50),
      marketScore: clampScore(parsed.marketScore, 50),
      competitorScore: clampScore(parsed.competitorScore, 50),
      monetizationScore: clampScore(parsed.monetizationScore, 50),
      riskScore: clampScore(parsed.riskScore, 50),
      marketAnalysis: String(parsed.marketAnalysis || "Market analysis not available."),
      competitorOverview: String(parsed.competitorOverview || "Competitor overview not available."),
      monetizationModels: String(parsed.monetizationModels || "Monetization analysis not available."),
      riskAssessment: String(parsed.riskAssessment || "Risk assessment not available."),
      nextSteps: String(parsed.nextSteps || "Next steps not available."),
      sources: allSources,
      valueHypothesis: String(parsed.valueHypothesis || ""),
      riskiestAssumption: String(parsed.riskiestAssumption || ""),
      pivotSuggestions: Array.isArray(parsed.pivotSuggestions) ? parsed.pivotSuggestions.slice(0, 3).map((p: Record<string, unknown>) => ({
        direction: String(p.direction || ""),
        description: String(p.description || ""),
        targetAudience: String(p.targetAudience || ""),
        viabilityEstimate: clampScore(p.viabilityEstimate, 50),
        keyPivot: String(p.keyPivot || ""),
      })) : [],
      usedFallback: false,
      confidence,
      adversarialVerdict,
      problemSeverity: clamp(parsed.problemSeverity, 5),
      marketUrgency: clamp(parsed.marketUrgency, 5),
      easeOfReplica: clamp(parsed.easeOfReplica, 5),
      founderIdeaFit: clamp(parsed.founderIdeaFit, 5),
      executionComplexity: clamp(parsed.executionComplexity, 5),
      nineDimensions: Array.isArray(parsed.nineDimensions) ? parsed.nineDimensions.slice(0, 9).map((d: Record<string, unknown>) => ({
        name: String(d.name || ""),
        shortName: String(d.shortName || ""),
        score: clamp(d.score, 5),
        maxScore: 10,
        label: String(d.label || ""),
        description: String(d.description || ""),
        icon: String(d.icon || ""),
      })) : getDefaultDimensions(),
      gtmExperiments: parseGTMExperiments(parsed.gtmExperiments),
      skepticAnalysis: parseSkepticAnalysis(parsed.skepticAnalysis),
      marketSizing: parseMarketSizing(parsed.marketSizing),
      actionPlan: parseActionPlan(parsed.actionPlan),
      swotAnalysis: parseSWOT(parsed.swotAnalysis),
      competitiveLandscape: parseCompetitiveLandscape(parsed.competitiveLandscape),
      marketTiming: parseMarketTiming(parsed.marketTiming),
    };
  } catch (err: unknown) {
    console.error("AI validation error:", err instanceof Error ? err.message : "unknown error");
    onProgress({ step: "fallback", label: "Using fallback analysis model", progress: 100 });
    return { ...getDemoResult(idea), usedFallback: true, confidence: 30, adversarialVerdict: "" };
  }
}

export async function validateIdea(idea: {
  title: string;
  description: string;
  targetAudience?: string;
  industry?: string;
  marketScope?: string;
}, aiConfig?: AIConfig): Promise<ValidationResult & { usedFallback: boolean; confidence: number; adversarialVerdict?: string }> {
  const onProgress = () => {};
  return validateIdeaStream(idea, onProgress, false, aiConfig);
}

const PIVOT_CHAT_SYSTEM_PROMPT = `You are IdeaForge AI's Pivot Assistant. You help founders rethink and improve their business ideas.

You will receive:
1. The original business idea and its validation report
2. The user's question or area they want to pivot on

Provide helpful, specific pivot advice. Be actionable and concrete - suggest real market segments, pricing models, and approaches. Keep responses focused and under 300 words.

Format your response as clear, actionable advice with bullet points where helpful.`;

export async function generatePivotSuggestions(
  idea: { title: string; description: string; targetAudience?: string; industry?: string },
  report: { viabilityScore: number; riskAssessment: string; marketAnalysis: string },
  onProgress?: (event: ProgressEvent) => void,
  aiConfig?: AIConfig
): Promise<PivotSuggestion[]> {
  const userMessage = `Original idea: "${sanitizeInput(idea.title, 200)}" - ${sanitizeInput(idea.description, 500)}
Target Audience: ${idea.targetAudience ? sanitizeInput(idea.targetAudience, 200) : "Not specified"}
Industry: ${idea.industry ? sanitizeInput(idea.industry, 100) : "Not specified"}
Viability Score: ${report.viabilityScore}/100
Risk Assessment: ${sanitizeInput(report.riskAssessment, 1000)}
Market Analysis: ${sanitizeInput(report.marketAnalysis, 1000)}

Generate 3 alternative pivot directions that could improve the viability score. Each should address the key risks.`;

  try {
    if (onProgress) {
      onProgress({ step: "pivots", label: "Generating personalized pivot suggestions...", progress: 50 });
      await sleep(600);
    }

    const content = await resolveProvider(aiConfig).provider.chat(
      [
        { role: "system", content: VALIDATION_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      { temperature: 0.8, maxTokens: 1500 }
    );
    const parsed = extractJson(content);
    if (!parsed) throw new Error("No JSON found");

    if (onProgress) onProgress({ step: "done", label: "Pivot suggestions ready!", progress: 100 });

    return (Array.isArray(parsed.pivotSuggestions) ? parsed.pivotSuggestions : []).slice(0, 3).map((p: Record<string, unknown>) => ({
      direction: String(p.direction || ""),
      description: String(p.description || ""),
      targetAudience: String(p.targetAudience || ""),
      viabilityEstimate: Math.min(100, Math.max(0, Number(p.viabilityEstimate) || 60)),
      keyPivot: String(p.keyPivot || ""),
    }));
  } catch (err: unknown) {
    console.error("Pivot generation error:", err instanceof Error ? err.message : "unknown error");
    if (onProgress) onProgress({ step: "done", label: "Using fallback pivots", progress: 100 });
    return getDemoPivots(idea);
  }
}

export async function pivotChat(
  message: string,
  context: { idea: { title: string; description: string }; report: { viabilityScore: number; marketAnalysis: string; riskAssessment: string } },
  history: { role: "user" | "assistant"; content: string }[],
  aiConfig?: AIConfig
): Promise<string> {
  const safeMessage = sanitizeInput(message, 500);
  const systemMsg = `${PIVOT_CHAT_SYSTEM_PROMPT}

Original Idea: "${sanitizeInput(context.idea.title, 200)}" - ${sanitizeInput(context.idea.description, 500)}
Current Viability Score: ${context.report.viabilityScore}/100
Market Analysis: ${sanitizeInput(context.report.marketAnalysis, 1000)}
Risk Assessment: ${sanitizeInput(context.report.riskAssessment, 1000)}`;

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: systemMsg },
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: sanitizeInput(h.content, 500) })),
      { role: "user", content: safeMessage },
    ];

    return await resolveProvider(aiConfig).provider.chat(messages, { temperature: 0.7, maxTokens: 800 });
  } catch (err: unknown) {
    console.error("Pivot chat error:", err instanceof Error ? err.message : "unknown error");
    return "I'm having trouble connecting to the AI. Please try again in a moment.";
  }
}

const GENERATE_SYSTEM_PROMPT = `You are IdeaForge AI, a creative business idea generator. Based on the user's interests, industry, or keywords, generate innovative and viable business ideas.

For each idea, provide a detailed analysis in the following JSON format:
{
  "ideas": [
    {
      "title": "<catchy business name/concept>",
      "description": "<2-3 sentence pitch of the idea>",
      "targetAudience": "<who this serves>",
      "industry": "<relevant industry>",
      "viabilityScore": <estimated score 0-100>,
      "marketOpportunity": "<1-2 sentences on why now is the right time>",
      "monetizationHint": "<brief revenue model suggestion>",
      "whyItWorks": "<1-2 sentences on the core competitive advantage>"
    }
  ]
}

Generate exactly 3 diverse, creative, and actionable ideas. Make them feel real and exciting - reference current trends, emerging technologies, or underserved markets. Avoid generic ideas.`;

export interface GeneratedIdea {
  title: string;
  description: string;
  targetAudience: string;
  industry: string;
  viabilityScore: number;
  marketOpportunity: string;
  monetizationHint: string;
  whyItWorks: string;
}

export async function generateIdeas(
  prompt: string,
  industry?: string,
  onProgress?: (event: ProgressEvent) => void,
  aiConfig?: AIConfig
): Promise<GeneratedIdea[]> {
  const safePrompt = sanitizeInput(prompt, 1000);
  const safeIndustry = industry ? sanitizeInput(industry, 100) : "";
  const userMessage = `Generate business ideas based on:

${safeIndustry ? `**Industry:** ${safeIndustry}\n` : ""}**Description:** ${safePrompt}

Generate 3 creative, actionable business ideas.`;

  try {
    if (onProgress) {
      onProgress({ step: "brainstorm", label: "AI is brainstorming ideas...", progress: 15 });
      await sleep(800);
      onProgress({ step: "analyzing", label: "Analyzing market opportunities...", progress: 35 });
      await sleep(600);
      onProgress({ step: "scoring", label: "Evaluating viability & uniqueness...", progress: 60 });
      await sleep(500);
      onProgress({ step: "polishing", label: "Polishing your ideas...", progress: 80 });
      await sleep(400);
    }

    const content = await resolveProvider(aiConfig).provider.chat(
      [
        { role: "system", content: GENERATE_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      { temperature: 0.9, maxTokens: 2000 }
    );
    const parsed = extractJson(content);
    if (!parsed) throw new Error("No JSON found in AI response");

    if (onProgress) onProgress({ step: "done", label: "Ideas generated!", progress: 100 });

    return (Array.isArray(parsed.ideas) ? parsed.ideas : []).map((idea: Record<string, unknown>) => ({
      title: String(idea.title || "Untitled Idea"),
      description: String(idea.description || ""),
      targetAudience: String(idea.targetAudience || ""),
      industry: String(idea.industry || industry || ""),
      viabilityScore: Math.min(100, Math.max(0, Number(idea.viabilityScore) || 70)),
      marketOpportunity: String(idea.marketOpportunity || ""),
      monetizationHint: String(idea.monetizationHint || ""),
      whyItWorks: String(idea.whyItWorks || ""),
    }));
  } catch (err: unknown) {
    console.error("AI generation error:", err instanceof Error ? err.message : "unknown error");
    if (onProgress) onProgress({ step: "fallback", label: "Using AI fallback model", progress: 100 });
    return getDemoIdeas(prompt, industry);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseGTMExperiments(raw: unknown): GTMExperiments {
  if (!raw || typeof raw !== "object") return getDefaultGTM();
  const r = raw as Record<string, unknown>;
  return {
    specificICP: String(r.specificICP || ""),
    landingPageHook: String(r.landingPageHook || ""),
    landingPageSubheadline: String(r.landingPageSubheadline || ""),
    minimumSuccessMetric: String(r.minimumSuccessMetric || ""),
    successTarget: String(r.successTarget || ""),
    experiments: Array.isArray(r.experiments) ? r.experiments.slice(0, 4).map((e: Record<string, string>) => ({
      title: String(e.title || ""),
      description: String(e.description || ""),
      cost: String(e.cost || ""),
      timeframe: String(e.timeframe || ""),
      metric: String(e.metric || ""),
    })) : getDefaultGTM().experiments,
    checklist: Array.isArray(r.checklist) ? r.checklist.slice(0, 5).map((c: Record<string, string>) => ({
      task: String(c.task || ""),
      why: String(c.why || ""),
      deadline: String(c.deadline || ""),
    })) : getDefaultGTM().checklist,
  };
}

function parseSkepticAnalysis(raw: unknown): SkepticAnalysis {
  if (!raw || typeof raw !== "object") return getDefaultSkepticAnalysis();
  const r = raw as Record<string, unknown>;
  return {
    overallVerdict: String(r.overallVerdict || "This idea faces significant challenges."),
    executionRisks: Array.isArray(r.executionRisks) ? r.executionRisks.slice(0, 3).map(String) : ["Execution complexity is higher than it appears."],
    regulatoryRisks: Array.isArray(r.regulatoryRisks) ? r.regulatoryRisks.slice(0, 2).map(String) : ["Regulatory compliance may be a hidden cost."],
    timingRisks: Array.isArray(r.timingRisks) ? r.timingRisks.slice(0, 2).map(String) : ["Market timing may be off."],
    structuralFlaws: Array.isArray(r.structuralFlaws) ? r.structuralFlaws.slice(0, 2).map(String) : ["The business model may have fundamental flaws."],
    brutalScore: Math.min(100, Math.max(0, Number(r.brutalScore) || 60)),
    keyChallenge: String(r.keyChallenge || "The biggest challenge is proving demand before running out of capital."),
  };
}

function parseMarketSizing(raw: unknown): MarketSizing {
  if (!raw || typeof raw !== "object") return getDefaultMarketSizing();
  const r = raw as Record<string, unknown>;
  return {
    tam: String(r.tam || ""),
    sam: String(r.sam || ""),
    som: String(r.som || ""),
    tamValue: String(r.tamValue || ""),
    samValue: String(r.samValue || ""),
    somValue: String(r.somValue || ""),
    reasoning: String(r.reasoning || ""),
  };
}

function parseActionPlan(raw: unknown): ActionPlanDay[] {
  if (!Array.isArray(raw)) return getDefaultActionPlan();
  return raw.slice(0, 7).map((day: Record<string, unknown>) => ({
    day: Number(day.day || 1),
    theme: String(day.theme || ""),
    tasks: Array.isArray(day.tasks) ? day.tasks.slice(0, 4).map(String) : ["Define your validation objective"],
    template: day.template ? String(day.template) : undefined,
    expectedOutcome: String(day.expectedOutcome || ""),
  }));
}

function parseSWOT(raw: unknown): SWOTAnalysis {
  if (!raw || typeof raw !== "object") return getDefaultSWOT();
  const r = raw as Record<string, unknown>;
  return {
    strengths: Array.isArray(r.strengths) ? r.strengths.slice(0, 5).map(String) : getDefaultSWOT().strengths,
    weaknesses: Array.isArray(r.weaknesses) ? r.weaknesses.slice(0, 5).map(String) : getDefaultSWOT().weaknesses,
    opportunities: Array.isArray(r.opportunities) ? r.opportunities.slice(0, 5).map(String) : getDefaultSWOT().opportunities,
    threats: Array.isArray(r.threats) ? r.threats.slice(0, 5).map(String) : getDefaultSWOT().threats,
  };
}

function parseCompetitiveLandscape(raw: unknown): CompetitiveLandscape {
  if (!raw || typeof raw !== "object") return getDefaultCompetitiveLandscape();
  const r = raw as Record<string, unknown>;
  return {
    directCompetitors: Array.isArray(r.directCompetitors) ? r.directCompetitors.slice(0, 5).map((c: Record<string, string>) => ({
      name: String(c.name || ""),
      description: String(c.description || ""),
      strength: String(c.strength || ""),
      weakness: String(c.weakness || ""),
    })) : getDefaultCompetitiveLandscape().directCompetitors,
    indirectCompetitors: Array.isArray(r.indirectCompetitors) ? r.indirectCompetitors.slice(0, 5).map((c: Record<string, string>) => ({
      name: String(c.name || ""),
      description: String(c.description || ""),
    })) : getDefaultCompetitiveLandscape().indirectCompetitors,
    marketGaps: Array.isArray(r.marketGaps) ? r.marketGaps.slice(0, 4).map(String) : getDefaultCompetitiveLandscape().marketGaps,
    differentiationStrategy: String(r.differentiationStrategy || getDefaultCompetitiveLandscape().differentiationStrategy),
  };
}

function parseMarketTiming(raw: unknown): MarketTiming {
  if (!raw || typeof raw !== "object") return getDefaultMarketTiming();
  const r = raw as Record<string, unknown>;
  const trend = String(r.trend || "stable");
  return {
    score: Math.min(10, Math.max(1, Number(r.score) || 5)),
    trend: (["rising", "stable", "declining"].includes(trend) ? trend : "stable") as "rising" | "stable" | "declining",
    reasoning: String(r.reasoning || ""),
    windowOfOpportunity: String(r.windowOfOpportunity || ""),
    signals: Array.isArray(r.signals) ? r.signals.slice(0, 6).map((s: Record<string, string>) => ({
      label: String(s.label || ""),
      direction: (["up", "down", "neutral"].includes(String(s.direction)) ? s.direction : "neutral") as "up" | "down" | "neutral",
    })) : getDefaultMarketTiming().signals,
  };
}

function getDefaultGTM(): GTMExperiments {
  return {
    specificICP: "Define your ideal customer profile based on the analysis above.",
    landingPageHook: "Start validating with a simple landing page and targeted outreach.",
    landingPageSubheadline: "Focus on the core value proposition identified in this report.",
    minimumSuccessMetric: "Aim for a 15-20% signup rate from qualified traffic to validate demand.",
    successTarget: "15%+ conversion from targeted traffic",
    experiments: [
      { title: "Landing Page + Waitlist", description: "Create a one-page Framer/Webflow site with the hook and sub-headline above. Drive traffic from your network.", cost: "$0", timeframe: "3 days", metric: "50+ waitlist signups" },
      { title: "LinkedIn Outreach", description: "Send 50 personalized connection requests to your specific ICP. Share the problem statement and gauge reaction.", cost: "$0", timeframe: "1 week", metric: "10+ positive replies" },
      { title: "Reddit/Community Posts", description: "Post in 3 relevant subreddits or communities describing the problem. Do NOT pitch the solution - just validate the pain.", cost: "$0", timeframe: "3 days", metric: "20+ upvotes or comments" },
      { title: "Pre-Sale Email", description: "Send a simple email to 30 ICP contacts offering early access at a discount. Track response rate.", cost: "$0", timeframe: "2 days", metric: "5+ interested responses" },
    ],
    checklist: [
      { task: "Write down your value hypothesis and riskiest assumption", why: "Clarifies what you're testing before you build anything", deadline: "Day 1" },
      { task: "Set up a landing page with the AI-generated hook", why: "Gives you a real asset to drive traffic to and measure conversion", deadline: "Day 1-2" },
      { task: "Identify 50 people matching your specific ICP", why: "You need a defined audience before any outreach makes sense", deadline: "Day 2" },
      { task: "Run at least 2 experiments this week", why: "Speed of learning matters more than perfection at this stage", deadline: "This week" },
      { task: "Collect results and revisit your viability score", why: "Real data should change your thinking - if it doesn't, you're not measuring the right things", deadline: "End of week 2" },
    ],
  };
}

function getDefaultSkepticAnalysis(): SkepticAnalysis {
  return {
    overallVerdict: "This idea faces typical startup challenges but could succeed with the right execution.",
    executionRisks: ["Building the MVP will take longer than expected.", "Key hires will be difficult to find."],
    regulatoryRisks: ["Compliance requirements may add hidden costs.", "Data privacy regulations could limit growth."],
    timingRisks: ["The market may not be ready yet.", "Competitors may move faster."],
    structuralFlaws: ["Unit economics may not work at scale.", "Customer acquisition costs may exceed lifetime value."],
    brutalScore: 55,
    keyChallenge: "Proving demand before running out of capital.",
  };
}

function getDefaultMarketSizing(): MarketSizing {
  return {
    tam: "The total addressable market is substantial but requires further validation.",
    sam: "The serviceable addressable market represents a meaningful opportunity.",
    som: "The serviceable obtainable market is achievable with focused execution.",
    tamValue: "$10B+",
    samValue: "$1B+",
    somValue: "$10M+",
    reasoning: "Based on industry benchmarks and comparable market segments.",
  };
}

function getDefaultActionPlan(): ActionPlanDay[] {
  return [
    { day: 1, theme: "Problem Discovery", tasks: ["Write down your value hypothesis", "Identify 5 people to interview"], expectedOutcome: "Clear problem statement documented" },
    { day: 2, theme: "Customer Interviews", tasks: ["Conduct 3 problem interviews", "Record pain points verbatim"], expectedOutcome: "Validated pain points from real users" },
    { day: 3, theme: "Solution Sketch", tasks: ["Draft solution concept", "Create 1-page mockup"], expectedOutcome: "Visual solution concept ready" },
    { day: 4, theme: "Landing Page", tasks: ["Build waitlist landing page", "Write AI-generated copy"], expectedOutcome: "Live landing page with analytics" },
    { day: 5, theme: "Traffic Test", tasks: ["Share with 20 ICP contacts", "Post in 2 communities"], expectedOutcome: "Initial traffic and signups data" },
    { day: 6, theme: "Feedback Loop", tasks: ["Analyze signup data", "Identify top objections"], expectedOutcome: "Clear learning from validation" },
    { day: 7, theme: "Decision Point", tasks: ["Review viability score", "Decide: pivot, persist, or kill"], expectedOutcome: "Clear next-step decision made" },
  ];
}

function getDefaultSWOT(): SWOTAnalysis {
  return {
    strengths: ["Novel approach to solving a real problem", "Low initial capital requirements", "Scalable technology foundation"],
    weaknesses: ["Unproven market demand", "No existing customer base", "Execution risk with small team"],
    opportunities: ["Growing market with increasing demand", "Underserved niche with limited competition", "Partnership potential with established players"],
    threats: ["Well-funded competitors could enter", "Market timing may shift", "Regulatory changes could impact operations"],
  };
}

function getDefaultCompetitiveLandscape(): CompetitiveLandscape {
  return {
    directCompetitors: [
      { name: "Established Player A", description: "Market leader with brand recognition", strength: "Large user base", weakness: "Slow to innovate" },
      { name: "Startup B", description: "Well-funded recent entrant", strength: "Strong engineering team", weakness: "Narrow feature set" },
    ],
    indirectCompetitors: [
      { name: "Manual Workaround", description: "Users currently solve this problem manually or with spreadsheets" },
      { name: "Adjacent Tool C", description: "Could add this feature with minimal effort" },
    ],
    marketGaps: ["No affordable solution for SMBs", "Lack of real-time data integration", "Poor user experience in existing tools"],
    differentiationStrategy: "Focus on ease of use, speed, and SMB-friendly pricing to capture the underserved segment.",
  };
}

function getDefaultMarketTiming(): MarketTiming {
  return {
    score: 6,
    trend: "rising",
    reasoning: "Market conditions are favorable with growing awareness and increasing demand in this space.",
    windowOfOpportunity: "12-18 months before market matures",
    signals: [
      { label: "Search Interest", direction: "up" },
      { label: "Funding Activity", direction: "up" },
      { label: "Competitor Growth", direction: "neutral" },
      { label: "Regulatory Environment", direction: "up" },
    ],
  };
}

function getDefaultDimensions(): NineDimension[] {
  return [
    { name: "Problem Severity", shortName: "problemSeverity", score: 5, maxScore: 10, label: "Is the pain point tier-1?", description: "Analysis unavailable - using default score.", icon: "problem" },
    { name: "Market Urgency", shortName: "marketUrgency", score: 5, maxScore: 10, label: "Do they need it solved today?", description: "Analysis unavailable - using default score.", icon: "urgency" },
    { name: "Market Size", shortName: "marketSize", score: 5, maxScore: 10, label: "How big is the TAM?", description: "Analysis unavailable - using default score.", icon: "market" },
    { name: "Competitive Moat", shortName: "competitiveMoat", score: 5, maxScore: 10, label: "Is the defensibility strong?", description: "Analysis unavailable - using default score.", icon: "moat" },
    { name: "Ease of Replica", shortName: "easeOfReplica", score: 5, maxScore: 10, label: "Can a competitor copy this?", description: "Analysis unavailable - using default score.", icon: "replica" },
    { name: "Revenue Potential", shortName: "revenuePotential", score: 5, maxScore: 10, label: "Can this generate real revenue?", description: "Analysis unavailable - using default score.", icon: "revenue" },
    { name: "Founder-Idea Fit", shortName: "founderIdeaFit", score: 5, maxScore: 10, label: "Does the team have expertise?", description: "Analysis unavailable - using default score.", icon: "fit" },
    { name: "Time to Market", shortName: "timeToMarket", score: 5, maxScore: 10, label: "How fast can you ship?", description: "Analysis unavailable - using default score.", icon: "time" },
    { name: "Scalability", shortName: "scalability", score: 5, maxScore: 10, label: "Does this grow without linear costs?", description: "Analysis unavailable - using default score.", icon: "scale" },
  ];
}

function getDemoResult(idea: { title: string; description: string }): ValidationResult {
  const hash = idea.title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const s = (base: number) => Math.min(95, Math.max(25, base + (hash % 20) - 10));
  const dim = (base: number) => Math.min(9, Math.max(2, base + (hash % 4) - 2));
  return {
    viabilityScore: s(65), marketScore: s(60), competitorScore: s(55),
    monetizationScore: s(60), riskScore: s(45),
    marketAnalysis: `The market for "${idea.title}" shows promising signs. Based on current industry trends, there is growing demand in this space. The total addressable market (TAM) is estimated to be in the billions, with a compound annual growth rate (CAGR) of 15-25% over the next 5 years.`,
    competitorOverview: `The competitive landscape includes several established players as well as emerging startups. Key differentiators for "${idea.title}" could include unique technology, superior user experience, or a niche market focus that incumbents have overlooked.`,
    monetizationModels: `1. **Subscription Model (SaaS):** Monthly/annual recurring revenue with tiered pricing. Recommended as the primary model for predictable revenue.\n2. **Freemium Model:** Offer a free tier to drive adoption, with premium features behind a paywall.\n3. **Transaction-Based:** Charge per transaction or per use, ideal for marketplace-style businesses.`,
    riskAssessment: `Key risks include:\n- **Market Risk (Medium):** Customer adoption may be slower than projected\n- **Competition Risk (High):** Well-funded competitors could enter the space\n- **Technical Risk (Low-Medium):** Build complexity and scalability challenges\n- **Financial Risk (Medium):** Extended runway needed before profitability`,
    nextSteps: `1. Conduct thorough customer discovery interviews (target 30+ conversations)\n2. Build a minimum viable product (MVP) focusing on core value proposition\n3. Validate pricing through pre-sales or letter of intent campaigns\n4. Develop a detailed financial model with conservative projections\n5. Identify and connect with potential early adopters in your target market\n6. Research and apply to relevant accelerators or funding programs\n7. Establish key metrics and KPIs to track progress`,
    sources: [
      { title: "Google Trends - Industry Search Interest", url: "https://trends.google.com/trends/explore", context: "Shows growing search interest in this market category" },
      { title: "Statista - Market Size Data", url: "https://www.statista.com", context: "Market size projections supporting TAM estimates" },
      { title: "CB Insights - Startup Funding Trends", url: "https://www.cbinsights.com/research", context: "Recent funding activity in adjacent spaces" },
    ],
    valueHypothesis: `We believe ${idea.description.slice(0, 80)} users will pay for a solution that addresses this need because current alternatives are insufficient.`,
    riskiestAssumption: "Target customers are willing to pay for a new solution instead of using their existing workaround.",
    pivotSuggestions: getDemoPivots(idea),
    usedFallback: true,
    problemSeverity: dim(6), marketUrgency: dim(5), easeOfReplica: dim(5), founderIdeaFit: dim(7),
    executionComplexity: dim(5),
    nineDimensions: [
      { name: "Problem Severity", shortName: "problemSeverity", score: dim(6), maxScore: 10, label: "Is the pain point tier-1?", description: "The problem exists but may not be top-of-mind for most potential customers.", icon: "problem" },
      { name: "Market Urgency", shortName: "marketUrgency", score: dim(5), maxScore: 10, label: "Do they need it solved today?", description: "Customers are aware of the problem but have existing workarounds.", icon: "urgency" },
      { name: "Market Size", shortName: "marketSize", score: dim(6), maxScore: 10, label: "How big is the TAM?", description: "The addressable market is substantial with growing demand.", icon: "market" },
      { name: "Competitive Moat", shortName: "competitiveMoat", score: dim(4), maxScore: 10, label: "Is the defensibility strong?", description: "Differentiation will require significant innovation or brand building.", icon: "moat" },
      { name: "Ease of Replica", shortName: "easeOfReplica", score: dim(5), maxScore: 10, label: "Can a competitor copy this?", description: "A determined competitor could build something similar in 3-6 months.", icon: "replica" },
      { name: "Revenue Potential", shortName: "revenuePotential", score: dim(6), maxScore: 10, label: "Can this generate real revenue?", description: "Multiple viable monetization paths exist with proven willingness to pay.", icon: "revenue" },
      { name: "Founder-Idea Fit", shortName: "founderIdeaFit", score: dim(7), maxScore: 10, label: "Does the team have expertise?", description: "Strong domain knowledge and relevant experience available.", icon: "fit" },
      { name: "Time to Market", shortName: "timeToMarket", score: dim(5), maxScore: 10, label: "How fast can you ship?", description: "An MVP could be built and launched within 2-3 months.", icon: "time" },
      { name: "Scalability", shortName: "scalability", score: dim(6), maxScore: 10, label: "Does this grow without linear costs?", description: "The business model supports efficient scaling with technology leverage.", icon: "scale" },
    ],
    gtmExperiments: getDefaultGTM(),
    skepticAnalysis: getDefaultSkepticAnalysis(),
    marketSizing: getDefaultMarketSizing(),
    actionPlan: getDefaultActionPlan(),
    swotAnalysis: getDefaultSWOT(),
    competitiveLandscape: getDefaultCompetitiveLandscape(),
    marketTiming: getDefaultMarketTiming(),
  };
}

function getDemoPivots(idea: { title: string }): PivotSuggestion[] {
  return [
    {
      direction: "B2B Enterprise",
      description: `Pivot ${idea.title} to serve enterprise clients instead of consumers. Enterprise deals provide higher LTV and more predictable revenue streams.`,
      targetAudience: "Mid-market companies (100-1000 employees)",
      viabilityEstimate: 72,
      keyPivot: "Shift from consumer to enterprise sales model with dedicated account management",
    },
    {
      direction: "Marketplace Platform",
      description: `Transform ${idea.title} into a two-sided marketplace connecting supply and demand. Marketplace models benefit from network effects and can scale exponentially.`,
      targetAudience: "Both sides of the market - providers and consumers",
      viabilityEstimate: 68,
      keyPivot: "Add a marketplace layer that connects service providers with customers directly",
    },
    {
      direction: "API/Infrastructure",
      description: `Reposition ${idea.title} as an API or infrastructure tool that other businesses build on top of. Developer-focused tools often achieve strong product-led growth.`,
      targetAudience: "Developers and technical teams at startups",
      viabilityEstimate: 65,
      keyPivot: "Sell the underlying capability as an API rather than a end-user product",
    },
  ];
}

function getDemoIdeas(prompt: string, industry?: string): GeneratedIdea[] {
  const ind = industry || "Technology";
  return [
    {
      title: "SmartQueue AI",
      description: "An AI-powered queue management system for restaurants and retail that predicts wait times, optimizes staffing, and lets customers join virtual queues from their phones.",
      targetAudience: "Restaurant owners, retail managers, event organizers",
      industry: ind,
      viabilityScore: 78,
      marketOpportunity: "Post-pandemic, 73% of consumers prefer contactless queue management. The market is projected to reach $1.2B by 2027.",
      monetizationHint: "SaaS subscription ($49-199/mo) + per-transaction fees for high-volume venues",
      whyItWorks: "Combines real-time ML predictions with an elegant mobile UX that competitors like WaitWhile lack.",
    },
    {
      title: "EcoTrack for SMBs",
      description: "A sustainability dashboard that helps small businesses measure, report, and reduce their carbon footprint with automated supply chain tracking.",
      targetAudience: "Small-to-medium businesses, ESG compliance teams, sustainability officers",
      industry: ind,
      viabilityScore: 82,
      marketOpportunity: "EU and US regulations now require SMBs to report emissions. Most can't afford enterprise solutions.",
      monetizationHint: "Freemium model with premium analytics ($29/mo) and compliance reporting ($99/mo)",
      whyItWorks: "No affordable solution exists for SMBs - enterprise tools start at $10K+/year.",
    },
    {
      title: "SkillSwap Marketplace",
      description: "A peer-to-peer skill exchange platform where professionals trade expertise - a designer teaches branding to a developer who teaches web scraping in return.",
      targetAudience: "Freelancers, career changers, lifelong learners",
      industry: ind,
      viabilityScore: 71,
      marketOpportunity: "The online education market is $350B but lacks authentic peer-to-peer exchange platforms.",
      monetizationHint: "Transaction fees (10%) + premium matching algorithm ($15/mo) + corporate team plans",
      whyItWorks: "Builds on the trust economy (like Airbnb for skills) while reducing cost of learning to zero.",
    },
  ];
}
