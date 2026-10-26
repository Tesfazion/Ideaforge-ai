import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

const onboardingSchema = z.object({
  role: z.string().min(1, "Role is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  ideaFrequency: z.string().min(1, "Idea frequency is required"),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { role, industries, ideaFrequency } = parsed.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      onboarding: { role, industries, ideaFrequency },
    });
  } catch (err: unknown) {
    console.error("Onboarding error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
