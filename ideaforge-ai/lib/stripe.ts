import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set. Payment features are disabled.");
    }
    stripeInstance = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  }
  return stripeInstance;
}

export const STRIPE_PLANS: Record<string, { priceId: string; amount: number; name: string }> = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter_monthly",
    amount: 200,
    name: "Starter (BYOK)",
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
    amount: 1900,
    name: "Founder Pro",
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_monthly",
    amount: 4900,
    name: "Enterprise",
  },
};

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function isPaidPlan(plan: string): boolean {
  return ["starter", "pro", "enterprise"].includes(plan);
}

export function canUseBYOK(plan: string): boolean {
  return isPaidPlan(plan);
}
