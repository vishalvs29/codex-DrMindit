import { prisma } from "../lib/prisma";
import { seedWellnessCatalog } from "../lib/services/catalog-service";

async function main() {
  await seedWellnessCatalog(prisma);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
