import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId, setAuthCookie, signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = await signToken(user.id);
    const response = NextResponse.json({
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
    setAuthCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("Refresh token error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
