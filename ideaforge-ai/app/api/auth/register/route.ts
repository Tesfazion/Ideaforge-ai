import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setAuthCookie, signToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`register:${ip}`, { windowMs: 60000, maxRequests: 5 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Name, valid email, and password (min 6 chars) are required" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: normalizedEmail, password: hashed },
    });
    const token = await signToken(user.id);
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: user.tokens, monthlyTokens: user.monthlyTokens, onboardingComplete: user.onboardingComplete },
    }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("Register error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
