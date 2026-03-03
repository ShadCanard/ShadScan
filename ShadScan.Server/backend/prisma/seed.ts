import { PrismaClient, ScanType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all(
    ["Courrier", "Photo de famille", "Document administratif", "Dessin", "Divers"].map(
      (name) =>
        prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        })
    )
  );

  // Seed tags
  const tags = await Promise.all(
    ["important", "archive", "personnel", "professionnel", "à trier", "ancien", "récent"].map(
      (name) =>
        prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
    )
  );

  console.log("Seed completed:");
  console.log(`  - ${categories.length} categories created`);
  console.log(`  - ${tags.length} tags created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
