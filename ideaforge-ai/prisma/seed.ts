import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@ideaforge.ai" },
    update: {},
    create: {
      name: "Test User",
      email: "test@ideaforge.ai",
      password: "password123",
    },
  });
  console.log("Seeded user:", user.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
