import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { encrypt, decrypt } from "@/lib/crypto";
import { PROVIDERS, maskApiKey } from "@/lib/ai-providers";

const saveSchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(8),
  model: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { apiKeyEncrypted: true, aiProvider: true, aiModel: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasKey = !!user.apiKeyEncrypted;
    let maskedKey = "";
    if (hasKey && user.apiKeyEncrypted) {
      try {
        const plain = decrypt(user.apiKeyEncrypted, userId);
        maskedKey = maskApiKey(plain);
      } catch {
        maskedKey = "•••• (decryption error)";
      }
    }

    return NextResponse.json({
      hasKey,
      provider: user.aiProvider || "",
      model: user.aiModel || "",
      maskedKey,
      providers: Object.entries(PROVIDERS).map(([key, cfg]) => ({
        id: key,
        label: cfg.label,
        models: cfg.models,
        defaultModel: cfg.defaultModel,
        docsUrl: cfg.docsUrl,
        keyPrefix: cfg.keyPrefix,
      })),
    });
  } catch (err: unknown) {
    console.error("Get AI config error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Provider, API key, and model are required" }, { status: 400 });
    }

    const { provider, apiKey, model } = parsed.data;
    const providerCfg = PROVIDERS[provider];
    if (!providerCfg) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    if (!providerCfg.models.includes(model)) {
      return NextResponse.json({ error: `Model "${model}" is not valid for ${providerCfg.label}` }, { status: 400 });
    }

    const encrypted = encrypt(apiKey.trim(), userId);
    await prisma.user.update({
      where: { id: userId },
      data: {
        apiKeyEncrypted: encrypted,
        aiProvider: provider,
        aiModel: model,
      },
    });

    return NextResponse.json({
      success: true,
      provider,
      model,
      maskedKey: maskApiKey(apiKey.trim()),
    });
  } catch (err: unknown) {
    console.error("Save AI config error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        apiKeyEncrypted: "",
        aiProvider: "",
        aiModel: "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete AI config error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to remove config" }, { status: 500 });
  }
}
