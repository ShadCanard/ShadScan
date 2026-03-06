import { PrismaClient, ScanType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all(
    ["Médecin","Travail","Personnel","Banque","Energie"].map(
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
    ["Ordonnance","Contrat de travail","Médicaments","Facture","Relevé","Divers"].map(
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
