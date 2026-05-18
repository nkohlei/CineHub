import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateShareId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

async function main() {
  console.log("Starting shareId migration for existing users...");
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} total users.`);

  for (const user of users) {
    if (!user.shareId) {
      let uniqueId = generateShareId();
      let isUnique = false;
      while (!isUnique) {
        const existing = await prisma.user.findFirst({
          where: { shareId: uniqueId },
        });
        if (!existing) {
          isUnique = true;
        } else {
          uniqueId = generateShareId();
        }
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { shareId: uniqueId },
      });
      console.log(`Assigned shareId: ${uniqueId} to user: ${user.email || user.id}`);
    } else {
      console.log(`User ${user.email || user.id} already has shareId: ${user.shareId}`);
    }
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
