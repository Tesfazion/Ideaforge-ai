import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

const announcementSchema = z.object({
  title: z.string().min(3).max(140),
  body: z.string().min(3).max(4000),
  version: z.string().max(32).optional().default(""),
  tag: z.enum(["release", "news", "update", "fix"]).optional().default("news"),
  pinned: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
});

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function getAdmin(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) return null;
  const admins = adminEmails();
  if (admins.length === 0) return user;
  return admins.includes(user.email.toLowerCase()) ? user : null;
}

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "1";
    const announcements = await prisma.announcement.findMany({
      where: all ? {} : { published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: all ? 100 : 30,
    });
    return NextResponse.json({ announcements });
  } catch (err: unknown) {
    console.error("Announcements fetch error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to load announcements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Only admins can post updates. Set ADMIN_EMAILS to allow your account." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = announcementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({ data: parsed.data });
    return NextResponse.json({ announcement }, { status: 201 });
  } catch (err: unknown) {
    console.error("Announcement create error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to post announcement" }, { status: 500 });
  }
}
