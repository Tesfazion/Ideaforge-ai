import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyPasswordResetToken } from "@/lib/jwt";

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`reset-password:${ip}`, { windowMs: 60000, maxRequests: 5 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Token and password (min 6 chars) are required" }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;

    let userId: string | null;
    try {
      userId = await verifyPasswordResetToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Invalid token type" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password has been reset successfully" });
  } catch (err: unknown) {
    console.error("Reset password error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
