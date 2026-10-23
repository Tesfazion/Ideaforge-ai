import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

function isAdmin(email: string) {
  const admins = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (admins.length === 0) return true;
  return admins.includes(email.toLowerCase());
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Only admins can delete updates." }, { status: 403 });
    }
    const { id } = await params;
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    console.error("Announcement delete error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
