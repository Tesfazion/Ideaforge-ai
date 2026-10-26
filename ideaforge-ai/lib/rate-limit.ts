import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const hashedKey = createHash("sha256").update(key).digest("hex");
  if (Math.random() < 0.01) {
    await prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } });
  }
  const [entry] = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${hashedKey}, 1, NOW() + (${config.windowMs} * INTERVAL '1 millisecond'))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."resetAt" <= NOW() THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimit"."resetAt" <= NOW()
          THEN NOW() + (${config.windowMs} * INTERVAL '1 millisecond')
        ELSE "RateLimit"."resetAt"
      END
    RETURNING "count", "resetAt"
  `;

  const resetIn = Math.max(0, Math.ceil((entry.resetAt.getTime() - Date.now()) / 1000));
  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetIn,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
