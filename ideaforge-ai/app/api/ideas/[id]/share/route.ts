import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

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
    const rateKey = `share:${userId}:${ip}`;
    const { allowed, remaining, resetIn } = checkRateLimit(rateKey, {
      windowMs: 3600000,
      maxRequests: 10,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later.", resetIn },
        { status: 429 }
      );
    }

    const { id } = await params;
    const idea = await prisma.idea.findFirst({ where: { id, userId } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const newIsPublic = !idea.isPublic;

    let publicSlug = idea.publicSlug;

    if (newIsPublic && !publicSlug) {
      const base = slugify(idea.title);
      let candidate = base;
      let suffix = 0;
      while (true) {
        const existing = await prisma.idea.findUnique({
          where: { publicSlug: candidate },
          select: { id: true },
        });
        if (!existing || existing.id === id) break;
        suffix++;
        candidate = `${base}-${suffix}`;
      }
      publicSlug = candidate;
    }

    const updated = await prisma.idea.update({
      where: { id },
      data: {
        isPublic: newIsPublic,
        publicSlug: newIsPublic ? publicSlug : null,
      },
    });

    const finalUrl = newIsPublic
      ? `${request.nextUrl.origin}/r/${updated.publicSlug}`
      : "";

    return NextResponse.json(
      {
        isPublic: updated.isPublic,
        publicSlug: updated.isPublic ? updated.publicSlug : null,
        publicUrl: updated.isPublic ? finalUrl : null,
        remaining,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Toggle share error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to toggle sharing" },
      { status: 500 }
    );
  }
}
