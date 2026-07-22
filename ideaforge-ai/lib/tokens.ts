import { prisma } from "./prisma";

const MONTHLY_TOKENS_FREE = 5;

export async function refillTokensIfNeeded(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const now = new Date();
  const lastRefill = new Date(user.lastTokenRefill);
  const monthsDiff =
    (now.getFullYear() - lastRefill.getFullYear()) * 12 +
    (now.getMonth() - lastRefill.getMonth());

  if (monthsDiff >= 1) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        tokens: MONTHLY_TOKENS_FREE,
        monthlyTokens: MONTHLY_TOKENS_FREE,
        lastTokenRefill: now,
      },
    });
  }
  return user;
}

export async function consumeToken(userId: string): Promise<{ success: boolean; remaining: number }> {
  const user = await refillTokensIfNeeded(userId);
  if (!user) return { success: false, remaining: 0 };

  if (user.plan !== "free") {
    return { success: true, remaining: -1 };
  }

  if (user.tokens <= 0) {
    return { success: false, remaining: 0 };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { tokens: { decrement: 1 } },
  });

  return { success: true, remaining: user.tokens - 1 };
}

export async function refundToken(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.plan !== "free") return;

  const maxTokens = MONTHLY_TOKENS_FREE;
  if (user.tokens < maxTokens) {
    await prisma.user.update({
      where: { id: userId },
      data: { tokens: { increment: 1 } },
    });
  }
}
