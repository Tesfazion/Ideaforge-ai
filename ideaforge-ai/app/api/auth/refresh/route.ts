import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId, signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = signToken(user.id);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        verified: user.verified,
        tokens: user.tokens,
        monthlyTokens: user.monthlyTokens,
      },
    });
  } catch (err: unknown) {
    console.error("Refresh token error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
