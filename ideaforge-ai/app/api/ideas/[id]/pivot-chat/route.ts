import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { pivotChat } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const rl = checkRateLimit(`pivot-chat:${userId}:${ip}`, { windowMs: 3600000, maxRequests: 20 });
    if (!rl.allowed) {
      return NextResponse.json({ error: `Rate limit exceeded. Try again in ${rl.resetIn}s` }, { status: 429 });
    }

    const { id: ideaId } = await params;
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
      include: { report: true },
    });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    if (!idea.report) {
      return NextResponse.json({ error: "Idea must be validated first" }, { status: 400 });
    }

    const reply = await pivotChat(
      message,
      {
        idea: { title: idea.title, description: idea.description },
        report: {
          viabilityScore: idea.report.viabilityScore,
          marketAnalysis: idea.report.marketAnalysis,
          riskAssessment: idea.report.riskAssessment,
        },
      },
      Array.isArray(history) ? history : []
    );

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Pivot chat failed:", err);
    return NextResponse.json({ error: "Pivot chat failed" }, { status: 500 });
  }
}
