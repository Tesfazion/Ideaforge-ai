import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const MONTHLY_TOKENS: Record<string, number> = {
  free: 5,
  pro: 100,
  enterprise: -1,
};

const PLAN_FROM_PRICE: Record<string, string> = {};

function initPriceMap() {
  const proId = process.env.STRIPE_PRO_PRICE_ID;
  const entId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
  if (proId) PLAN_FROM_PRICE[proId] = "pro";
  if (entId) PLAN_FROM_PRICE[entId] = "enterprise";
}
initPriceMap();

async function findUser(subscription: Stripe.Subscription): Promise<{ id: string; plan: string } | null> {
  const userId = subscription.metadata?.userId;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, plan: true } });
    if (user) return user;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const body = await request.text();
    const sig = request.headers.get("stripe-signature");
    if (!sig || !webhookSecret) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" });
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      console.error("[Stripe Webhook] Signature verification failed:", err instanceof Error ? err.message : "unknown error");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

    // Idempotency: check if event already processed
    const existing = await prisma.contactInquiry.findFirst({
      where: { company: `stripe_event:${event.id}` },
      select: { id: true },
    }).catch(() => null);
    if (existing) {
      console.log(`[Stripe Webhook] Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "pro";

        if (!userId) {
          console.warn("[Stripe Webhook] checkout.session.completed missing userId in metadata");
          return NextResponse.json({ received: true });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          console.error(`[Stripe Webhook] User not found: ${userId}`);
          return NextResponse.json({ received: true });
        }

        const tokens = plan in MONTHLY_TOKENS ? MONTHLY_TOKENS[plan] : 5;
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            tokens,
            monthlyTokens: tokens,
            lastTokenRefill: new Date(),
          },
        });

        console.log(`[Stripe Webhook] User ${userId} upgraded to ${plan} (${tokens} tokens)`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await findUser(subscription);
        if (!user) {
          console.warn(`[Stripe Webhook] No user found for subscription ${subscription.id}`);
          return NextResponse.json({ received: true });
        }

        const priceId = subscription.items.data[0]?.price?.id;
        const newPlan = priceId ? (PLAN_FROM_PRICE[priceId] || user.plan) : user.plan;
        const isDeleted = subscription.status === "canceled" || subscription.status === "unpaid";

        // If subscription is still active, keep the plan even if cancel_at_period_end
        if (isDeleted) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "free", tokens: 5, monthlyTokens: 5, lastTokenRefill: new Date() },
          });
          console.log(`[Stripe Webhook] User ${user.id} downgraded to free (subscription canceled/unpaid)`);
        } else {
          const tokens = newPlan in MONTHLY_TOKENS ? MONTHLY_TOKENS[newPlan] : 5;
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: newPlan, tokens, monthlyTokens: tokens, lastTokenRefill: new Date() },
          });
          console.log(`[Stripe Webhook] User ${user.id} plan updated: ${user.plan} -> ${newPlan}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await findUser(subscription);
        if (!user) {
          console.warn(`[Stripe Webhook] No user found for deleted subscription ${subscription.id}`);
          return NextResponse.json({ received: true });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { plan: "free", tokens: 5, monthlyTokens: 5, lastTokenRefill: new Date() },
        });

        console.log(`[Stripe Webhook] User ${user.id} downgraded to free (subscription deleted)`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Only reset tokens on actual monthly cycle renewals, not prorations or one-time
        if (invoice.billing_reason !== "subscription_cycle") {
          console.log(`[Stripe Webhook] Invoice ${invoice.id} billing_reason=${invoice.billing_reason}, skipping token reset`);
          break;
        }

        const subscriptionId = (invoice as unknown as Record<string, unknown>).subscription as string | null;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const user = await findUser(subscription);
        if (!user) {
          console.warn(`[Stripe Webhook] No user found for invoice ${invoice.id}`);
          return NextResponse.json({ received: true });
        }

        const priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? (PLAN_FROM_PRICE[priceId] || user.plan) : user.plan;
        const monthlyTokens = plan in MONTHLY_TOKENS ? MONTHLY_TOKENS[plan] : 5;

        await prisma.user.update({
          where: { id: user.id },
          data: { plan, tokens: monthlyTokens, monthlyTokens, lastTokenRefill: new Date() },
        });

        console.log(`[Stripe Webhook] User ${user.id} tokens refreshed: ${monthlyTokens} (plan: ${plan})`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as unknown as Record<string, unknown>).subscription as string | null;
        console.error(`[Stripe Webhook] Payment failed for invoice ${invoice.id} (subscription: ${subscriptionId}, attempt: ${invoice.attempt_count})`);
        break;
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await findUser(subscription);
        if (user) {
          const trialEnd = subscription.trial_end;
          const daysRemaining = trialEnd ? Math.ceil((trialEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24)) : "?";
          console.log(`[Stripe Webhook] User ${user.id} trial ending in ~${daysRemaining} days`);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Mark event as processed for idempotency
    await prisma.contactInquiry.create({
      data: {
        email: "stripe@webhook.local",
        company: `stripe_event:${event.id}`,
        message: event.type,
      },
    }).catch(() => {});

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("[Stripe Webhook] Handler error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
