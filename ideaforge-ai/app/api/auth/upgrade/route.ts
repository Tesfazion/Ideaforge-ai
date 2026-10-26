import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { isStripeConfigured, getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Payment system not configured. Please contact support." }, { status: 503 });
    }

    let body: { sessionId?: string } = {};
    try { body = await request.json(); } catch {}

    if (body.sessionId) {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(body.sessionId);
      if (session.payment_status === "paid" && session.metadata?.userId === userId) {
        const plan = session.metadata.plan || "pro";
        const user = await prisma.user.update({ where: { id: userId }, data: { plan } });
        return NextResponse.json({
          user: { id: user.id, name: user.name, email: user.email, plan: user.plan, verified: user.verified, tokens: user.tokens, monthlyTokens: user.monthlyTokens },
        });
      }
      return NextResponse.json({ error: "Payment not completed or session invalid" }, { status: 400 });
    }

    return NextResponse.json({ error: "Session ID required for production upgrades" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Upgrade error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
  }
}
