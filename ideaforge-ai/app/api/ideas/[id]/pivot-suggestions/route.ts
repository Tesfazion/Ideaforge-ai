import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { generatePivotSuggestions } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserId(request);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = checkRateLimit(`pivots:${userId}:${ip}`, { windowMs: 3600000, maxRequests: 10 });
  if (!rl.allowed) {
    return Response.json({ error: `Rate limit exceeded. Try again in ${rl.resetIn}s` }, { status: 429 });
  }

  const { id: ideaId } = await params;

  const idea = await prisma.idea.findFirst({
    where: { id: ideaId, userId },
    include: { report: true },
  });
  if (!idea) {
    return Response.json({ error: "Idea not found" }, { status: 404 });
  }
  if (!idea.report) {
    return Response.json({ error: "Idea must be validated first" }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function sendEvent(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const pivots = await generatePivotSuggestions(
          {
            title: idea.title,
            description: idea.description,
            targetAudience: idea.targetAudience || undefined,
            industry: idea.industry || undefined,
          },
          {
            viabilityScore: idea.report!.viabilityScore,
            riskAssessment: idea.report!.riskAssessment,
            marketAnalysis: idea.report!.marketAnalysis,
          },
          (progressEvent) => {
            sendEvent({ type: "progress", ...progressEvent });
          }
        );

        await prisma.report.update({
          where: { ideaId: idea.id },
          data: { pivotSuggestions: JSON.stringify(pivots) },
        });

        sendEvent({ type: "complete", pivots });
      } catch (err: unknown) {
        console.error("Pivot suggestions failed:", err);
        sendEvent({ type: "error", message: "Failed to generate pivot suggestions" });
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
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
