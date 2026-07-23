import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { randomBytes, createHash } from "crypto";

function generateApiKey(): string {
  const hex = randomBytes(16).toString("hex");
  return `if_${hex}`;
}

function maskKey(key: string): string {
  if (key.length <= 12) return key.slice(0, 7) + "..." + key.slice(-4);
  return key.slice(0, 7) + "..." + key.slice(-4);
}

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.plan !== "enterprise") {
      return NextResponse.json(
        { error: "API keys are only available for Enterprise tier users" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const rl = checkRateLimit(`enterprise-keys:${userId}:${ip}`, {
      windowMs: 3600000,
      maxRequests: 10,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rl.resetIn}s` },
        { status: 429 }
      );
    }

    const keys = await prisma.apiKey.findMany({
      where: { userId, revoked: false },
      select: { id: true, keyPreview: true, name: true, createdAt: true, lastUsedAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      keys: keys.map((k) => ({
        id: k.id,
        key: k.keyPreview,
        name: k.name,
        createdAt: k.createdAt.toISOString(),
        lastUsedAt: k.lastUsedAt?.toISOString() || null,
      })),
    });
  } catch (err: unknown) {
    console.error("Get API keys error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.plan !== "enterprise") {
      return NextResponse.json(
        { error: "API keys are only available for Enterprise tier users" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const rl = checkRateLimit(`enterprise-keys:${userId}:${ip}`, {
      windowMs: 3600000,
      maxRequests: 10,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rl.resetIn}s` },
        { status: 429 }
      );
    }

    const activeKeys = await prisma.apiKey.count({
      where: { userId, revoked: false },
    });
    if (activeKeys >= 10) {
      return NextResponse.json(
        { error: "Maximum of 10 active API keys reached. Revoke some keys first." },
        { status: 400 }
      );
    }

    let name = "API Key";
    try {
      const body = await request.json();
      name = body.name || "API Key";
    } catch {}

    const rawKey = generateApiKey();
    const keyHash = hashKey(rawKey);

    const newKey = await prisma.apiKey.create({
      data: {
        keyHash,
        keyPreview: maskKey(rawKey),
        userId,
        name,
      },
    });

    return NextResponse.json(
      {
        id: newKey.id,
        key: rawKey,
        name: newKey.name,
        createdAt: newKey.createdAt.toISOString(),
        message: "API key created. Copy it now — it won't be shown again.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Create API key error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.plan !== "enterprise") {
      return NextResponse.json(
        { error: "API keys are only available for Enterprise tier users" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    const rl = checkRateLimit(`enterprise-keys:${userId}:${ip}`, {
      windowMs: 3600000,
      maxRequests: 10,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rl.resetIn}s` },
        { status: 429 }
      );
    }

    const { keyId } = await request.json();
    if (!keyId) {
      return NextResponse.json({ error: "keyId is required" }, { status: 400 });
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });
    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { revoked: true },
    });

    return NextResponse.json({ message: "API key revoked successfully" });
  } catch (err: unknown) {
    console.error("Revoke API key error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500 }
    );
  }
}
