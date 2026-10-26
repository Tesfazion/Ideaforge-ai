import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getStripe, STRIPE_PLANS, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await checkRateLimit(`checkout:${ip}`, { windowMs: 60000, maxRequests: 10 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isStripeConfigured()) {
      const user = await prisma.user.update({ where: { id: userId }, data: { plan: "pro" } });
      const sessionId = `dev_mock_${Date.now()}`;
      const url = `/dashboard/payment/success?session_id=${sessionId}&plan=pro`;
      return NextResponse.json({ sessionId, url, plan: "pro", amount: 1900, currency: "usd", user: { id: user.id, name: user.name, email: user.email, plan: "pro" } });
    }

    const { plan } = await request.json();
    if (!plan || !["pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Valid plan ('pro' or 'enterprise') is required" }, { status: 400 });
    }

    const planConfig = STRIPE_PLANS[plan];
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:1212"}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:1212"}/dashboard/upgrade`,
      metadata: { userId, plan },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url, plan, amount: planConfig.amount, currency: "usd" });
  } catch (err: unknown) {
    console.error("Create checkout session error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
