import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`login:${ip}`, { windowMs: 60000, maxRequests: 10 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email and password are required" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = signToken(user.id);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: user.tokens, monthlyTokens: user.monthlyTokens },
    });
    response.cookies.set("ideaforge_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (err: unknown) {
    console.error("Login error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
