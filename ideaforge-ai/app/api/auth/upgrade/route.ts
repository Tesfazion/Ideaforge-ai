import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { plan: "pro" } });
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified },
    });
  } catch (err: unknown) {
    console.error("Upgrade error:", err);
    return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
  }
}
