import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ideaId } = await params;

    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
      include: { report: true },
    });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    if (!idea.report) {
      return NextResponse.json(
        { message: "Report is still being generated", idea: { id: idea.id, title: idea.title, status: idea.status } },
        { status: 202 }
      );
    }
    return NextResponse.json({ report: idea.report, idea: { id: idea.id, title: idea.title, status: idea.status } });
  } catch (err: unknown) {
    console.error("Get report error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  }
}
