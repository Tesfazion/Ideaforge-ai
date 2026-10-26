import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`login:${ip}`, { windowMs: 60000, maxRequests: 10 });
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email and password are required" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const emailRl = await checkRateLimit(`login-email:${email}`, { windowMs: 900000, maxRequests: 5 });
    if (!rl.allowed || !emailRl.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const { password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = await signToken(user.id);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: user.tokens, monthlyTokens: user.monthlyTokens, onboardingComplete: user.onboardingComplete },
    });
    setAuthCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("Login error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
