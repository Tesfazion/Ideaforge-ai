import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Vercel functions have an ephemeral writable /tmp directory. Local uploads
// stay in the ignored project uploads folder during development.
const UPLOAD_DIR = process.env.VERCEL ? join("/tmp", "ideaforge-uploads") : join(process.cwd(), "uploads");

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {}
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ideas = await prisma.idea.findMany({
      where: { userId },
      include: { report: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ideas });
  } catch (err: unknown) {
    console.error("Get ideas error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let title: string;
    let description: string;
    let targetAudience: string | undefined;
    let industry: string | undefined;
    let marketScope: string | undefined;
    let attachmentFilename = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = formData.get("title") as string;
      description = formData.get("description") as string;
      targetAudience = (formData.get("targetAudience") as string) || undefined;
      industry = (formData.get("industry") as string) || undefined;
      marketScope = (formData.get("marketScope") as string) || undefined;
      const file = formData.get("file") as File | null;
      if (file && file.size > 0) {
        await ensureUploadDir();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        attachmentFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(join(UPLOAD_DIR, attachmentFilename), buffer);
      }
    } else {
      const body = await request.json();
      title = body.title;
      description = body.description;
      targetAudience = body.targetAudience;
      industry = body.industry;
      marketScope = body.marketScope;
    }

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        targetAudience: targetAudience || "",
        industry: industry || "",
        marketScope: marketScope || "global",
        attachments: attachmentFilename,
        userId,
      },
    });

    return NextResponse.json({ idea: { ...idea, status: "processing" } }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create idea error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to create idea" }, { status: 500 });
  }
}
