import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "test@ideaforge.ai" },
    update: { password: hashedPassword },
    create: {
      name: "Test User",
      email: "test@ideaforge.ai",
      password: hashedPassword,
    },
  });
  console.log("Seeded user:", user.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
