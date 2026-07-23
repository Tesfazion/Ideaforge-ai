import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { validateIdeaStream } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { consumeToken, refundToken } from "@/lib/tokens";
import { randomBytes } from "crypto";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) + "-" + randomBytes(8).toString("hex");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserId(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`validate:${userId}:${ip}`, { windowMs: 3600000, maxRequests: 5 });
  if (!rl.allowed) {
    return Response.json({ error: `Rate limit exceeded. Try again in ${rl.resetIn}s` }, { status: 429 });
  }

  const { id: ideaId } = await params;

  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId },
  });
  if (!idea) {
    return Response.json({ error: "Idea not found" }, { status: 404 });
  }
  if (idea.status === "validated") {
    return Response.json({ error: "Idea already validated" }, { status: 400 });
  }

  let skepticMode = false;
  try {
    const body = await request.json();
    skepticMode = body?.skepticMode === true;
  } catch {}

  const tokenResult = await consumeToken(userId);
  if (!tokenResult.success) {
    return Response.json({ error: "No validation credits remaining. Upgrade to Pro for unlimited validations." }, { status: 403 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const result = await validateIdeaStream(
          {
            title: idea.title,
            description: idea.description,
            targetAudience: idea.targetAudience || undefined,
            industry: idea.industry || undefined,
            marketScope: idea.marketScope || undefined,
          },
          (progressEvent) => {
            sendEvent({ type: "progress", ...progressEvent });
          },
          skepticMode
        );

        if (result.usedFallback) {
          await refundToken(userId);
          sendEvent({ type: "error", message: "AI analysis unavailable. Token refunded. Please check your API key configuration." });
          await prisma.idea.update({ where: { id: idea.id }, data: { status: "failed" } }).catch(() => {});
          controller.close();
          return;
        }

        const publicSlug = generateSlug(idea.title);

        const created = await prisma.report.create({
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
          data: { status: "validated", publicSlug, isPublic: false },
        });

        sendEvent({ type: "complete", report: created, publicUrl: `/r/${publicSlug}` });
      } catch (err: unknown) {
        console.error(`Streaming validation failed for idea ${ideaId}:`, err instanceof Error ? err.message : "unknown error");
        await prisma.idea.update({ where: { id: idea.id }, data: { status: "failed" } }).catch(() => {});
        await refundToken(userId);
        sendEvent({ type: "error", message: "AI validation failed. Token refunded." });
      }

      controller.close();
    },
    cancel() {
      prisma.idea.update({ where: { id: ideaId }, data: { status: "failed" } }).catch(() => {});
      refundToken(userId).catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
