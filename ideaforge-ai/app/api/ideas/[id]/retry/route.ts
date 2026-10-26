import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: ideaId } = await params;

    const idea = await prisma.idea.findFirst({
      where: { id: ideaId, userId },
    });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    if (idea.status !== "failed") {
      return NextResponse.json({ error: "Only failed ideas can be retried" }, { status: 400 });
    }

    await prisma.idea.update({ where: { id: idea.id }, data: { status: "pending" } });
    await prisma.report.deleteMany({ where: { ideaId: idea.id } });

    return NextResponse.json({ message: "Idea reset for retry", ideaId: idea.id });
  } catch (err: unknown) {
    console.error("Retry error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}
