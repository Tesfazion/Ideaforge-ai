import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
});

const PREVIEW_PROMPT = `You are a quick business idea scorer. Given a title and description, return ONLY a JSON object (no markdown, no explanation) with these exact fields:
{
  "viabilityScore": <number 0-100>,
  "marketScore": <number 0-100>,
  "competitorScore": <number 0-100>,
  "monetizationScore": <number 0-100>,
  "riskScore": <number 0-100>,
  "message": "<1-sentence summary of viability>"
}
Be concise and conservative. Score fairly. Return ONLY the JSON.`;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`preview:${ip}`, { windowMs: 60000, maxRequests: 5 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait before trying again." }, { status: 429 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const clamp = (v: unknown, def: number) => Math.min(100, Math.max(0, Number(v) || def));

    try {
      const response = await client.chat.completions.create({
        model: process.env.AI_MODEL || "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: PREVIEW_PROMPT },
          { role: "user", content: `Title: ${title}\nDescription: ${description}` },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON");

      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        viabilityScore: clamp(parsed.viabilityScore, 50),
        marketScore: clamp(parsed.marketScore, 50),
        competitorScore: clamp(parsed.competitorScore, 50),
        monetizationScore: clamp(parsed.monetizationScore, 50),
        riskScore: clamp(parsed.riskScore, 50),
        usedFallback: false,
        message: "Preview generated. Sign up to unlock the full report with TAM/SAM/SOM, skeptic analysis, and 7-day action plan.",
      });
    } catch {
      const hash = (title + description).split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
      const s = (base: number) => Math.min(90, Math.max(30, base + (hash % 20) - 10));
      return NextResponse.json({
        viabilityScore: s(60),
        marketScore: s(55),
        competitorScore: s(50),
        monetizationScore: s(55),
        riskScore: s(45),
        usedFallback: true,
        message: "Preview generated with fallback model. Sign up for live-sourced analysis.",
      });
    }
  } catch (err: unknown) {
    console.error("Preview error:", err);
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
  }
}
