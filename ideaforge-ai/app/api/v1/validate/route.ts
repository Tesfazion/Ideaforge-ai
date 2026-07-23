import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { consumeToken } from "@/lib/tokens";
import { validateIdea } from "@/lib/ai";
import { createHash } from "crypto";

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

async function validateApiKey(
  apiKey: string
): Promise<{ userId: string; keyId: string } | null> {
  const keyHash = hashKey(apiKey);

  const match = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, userId: true, revoked: true },
  });

  if (!match || match.revoked) return null;

  await prisma.apiKey.update({
    where: { id: match.id },
    data: { lastUsedAt: new Date() },
  });

  return { userId: match.userId, keyId: match.id };
}

function sanitizeInput(input: string, maxLength: number = 2000): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/```[\s\S]*?```/g, "[code block removed]")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || !apiKey.startsWith("if_")) {
      return NextResponse.json(
        {
          error: "Invalid or missing API key. Provide a valid key via X-API-Key header.",
        },
        { status: 401 }
      );
    }

    const authResult = await validateApiKey(apiKey);
    if (!authResult) {
      return NextResponse.json(
        { error: "Invalid or revoked API key" },
        { status: 401 }
      );
    }

    const { userId, keyId } = authResult;

    const ip = getClientIp(request);
    const rl = checkRateLimit(`api-validate:${keyId}:${ip}`, {
      windowMs: 3600000,
      maxRequests: 20,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again in ${rl.resetIn}s.`,
          rateLimit: {
            remaining: 0,
            resetIn: rl.resetIn,
            limit: 20,
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000 + rl.resetIn)),
          },
        }
      );
    }

    const body = await request.json();
    const { title, description, targetAudience, industry, marketScope } = body;

    if (!title || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields: title and description are required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "free" && user.tokens <= 0) {
      return NextResponse.json(
        {
          error: "No tokens remaining. Upgrade your plan for unlimited validations.",
        },
        { status: 402 }
      );
    }

    const idea = await prisma.idea.create({
      data: {
        title: sanitizeInput(title, 500),
        description: sanitizeInput(description, 2000),
        targetAudience: targetAudience ? sanitizeInput(targetAudience, 200) : "",
        industry: industry ? sanitizeInput(industry, 100) : "",
        marketScope: marketScope ? sanitizeInput(marketScope, 50) : "global",
        status: "validated",
        userId,
      },
    });

    const result = await validateIdea({
      title: sanitizeInput(title, 500),
      description: sanitizeInput(description, 2000),
      targetAudience: targetAudience ? sanitizeInput(targetAudience, 200) : undefined,
      industry: industry ? sanitizeInput(industry, 100) : undefined,
      marketScope: marketScope ? sanitizeInput(marketScope, 50) : undefined,
    });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) +
      "-" +
      Math.random().toString(36).slice(2, 8);

    await prisma.report.create({
      data: {
        viabilityScore: result.viabilityScore,
        marketScore: result.marketScore,
        competitorScore: result.competitorScore,
        monetizationScore: result.monetizationScore,
        riskScore: result.riskScore,
        marketAnalysis: result.marketAnalysis,
        competitorOverview: result.competitorOverview,
        monetizationModels: result.monetizationModels,
        riskAssessment: result.riskAssessment,
        nextSteps: result.nextSteps,
        sources: JSON.stringify(result.sources),
        valueHypothesis: result.valueHypothesis,
        riskiestAssumption: result.riskiestAssumption,
        pivotSuggestions: JSON.stringify(result.pivotSuggestions),
        usedFallback: result.usedFallback,
        problemSeverity: result.problemSeverity,
        marketUrgency: result.marketUrgency,
        easeOfReplica: result.easeOfReplica,
        founderIdeaFit: result.founderIdeaFit,
        executionComplexity: result.executionComplexity,
        nineDimensions: JSON.stringify(result.nineDimensions),
        gtmExperiments: JSON.stringify(result.gtmExperiments),
        skepticAnalysis: JSON.stringify(result.skepticAnalysis),
        marketSizing: JSON.stringify(result.marketSizing),
        actionPlan: JSON.stringify(result.actionPlan),
        swotAnalysis: JSON.stringify(result.swotAnalysis),
        competitiveLandscape: JSON.stringify(result.competitiveLandscape),
        marketTiming: JSON.stringify(result.marketTiming),
        confidence: result.confidence || 70,
        adversarialVerdict: result.adversarialVerdict || "",
        ideaId: idea.id,
      },
    });

    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "validated", publicSlug: slug, isPublic: true },
    });

    if (user.plan === "free") {
      await consumeToken(userId);
    }

    return NextResponse.json(
      {
        id: idea.id,
        status: "validated",
        report: {
          viabilityScore: result.viabilityScore,
          marketScore: result.marketScore,
          competitorScore: result.competitorScore,
          monetizationScore: result.monetizationScore,
          riskScore: result.riskScore,
          marketAnalysis: result.marketAnalysis,
          competitorOverview: result.competitorOverview,
          monetizationModels: result.monetizationModels,
          riskAssessment: result.riskAssessment,
          nextSteps: result.nextSteps,
          sources: result.sources,
          valueHypothesis: result.valueHypothesis,
          riskiestAssumption: result.riskiestAssumption,
          pivotSuggestions: result.pivotSuggestions,
          problemSeverity: result.problemSeverity,
          marketUrgency: result.marketUrgency,
          easeOfReplica: result.easeOfReplica,
          founderIdeaFit: result.founderIdeaFit,
          executionComplexity: result.executionComplexity,
          nineDimensions: result.nineDimensions,
          gtmExperiments: result.gtmExperiments,
          skepticAnalysis: result.skepticAnalysis,
          marketSizing: result.marketSizing,
          actionPlan: result.actionPlan,
          swotAnalysis: result.swotAnalysis,
          competitiveLandscape: result.competitiveLandscape,
          marketTiming: result.marketTiming,
          confidence: result.confidence,
          adversarialVerdict: result.adversarialVerdict,
          usedFallback: result.usedFallback,
        },
        publicUrl: `/r/${slug}`,
      },
      {
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000 + rl.resetIn)),
        },
      }
    );
  } catch (err: unknown) {
    console.error("API validation error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Internal server error during validation" },
      { status: 500 }
    );
  }
}
