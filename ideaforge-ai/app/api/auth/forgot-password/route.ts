import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required.");
  }
  if (secret.length < 16) {
    throw new Error("JWT_SECRET must be at least 16 characters.");
  }
  return secret;
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`forgot-password:${ip}`, { windowMs: 60000, maxRequests: 5 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const { email } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      getSecret(),
      { expiresIn: "1h" }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate email service (e.g., Resend, SendGrid, Nodemailer)
      // await sendEmail({ to: user.email, subject: "Reset your IdeaForge password", ... });
      console.log(`[PROD] Password reset email would be sent to: ${user.email}`);
    } else {
      console.log(`\n🔗 Password reset link for ${user.email}:\n${resetUrl}\n`);
    }

    return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });
  } catch (err: unknown) {
    console.error("Forgot password error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
