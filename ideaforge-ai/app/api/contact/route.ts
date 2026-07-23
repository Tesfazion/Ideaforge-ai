import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  email: z.string().email(),
  company: z.string().min(1).max(200),
  teamSize: z.string().max(50).optional().default(""),
  message: z.string().max(5000).optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`contact:${ip}`, { windowMs: 300000, maxRequests: 3 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email and company are required" }, { status: 400 });
    }

    const { email, company, teamSize, message } = parsed.data;

    await prisma.contactInquiry.create({
      data: {
        email: email.trim().toLowerCase(),
        company: company.trim(),
        teamSize,
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, message: "Inquiry received. We'll get back to you within 24 hours." });
  } catch (err: unknown) {
    console.error("Contact error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
