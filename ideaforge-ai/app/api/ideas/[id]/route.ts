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
    const { id } = await params;
    const idea = await prisma.idea.findFirst({
      where: { id, userId },
      include: { report: true },
    });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    return NextResponse.json({ idea });
  } catch (err: unknown) {
    console.error("Get idea error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const idea = await prisma.idea.findFirst({ where: { id, userId } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    const body = await request.json();
    const updated = await prisma.idea.update({
      where: { id },
      data: {
        title: body.title ?? idea.title,
        description: body.description ?? idea.description,
        targetAudience: body.targetAudience ?? idea.targetAudience,
        industry: body.industry ?? idea.industry,
        marketScope: body.marketScope ?? idea.marketScope,
      },
      include: { report: true },
    });
    return NextResponse.json({ idea: updated });
  } catch (err: unknown) {
    console.error("Update idea error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to update idea" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const idea = await prisma.idea.findFirst({ where: { id, userId } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    await prisma.idea.delete({ where: { id } });
    return NextResponse.json({ message: "Idea deleted" });
  } catch (err: unknown) {
    console.error("Delete idea error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
  }
}
