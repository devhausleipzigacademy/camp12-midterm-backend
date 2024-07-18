import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seatIds = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];

  await Promise.all(
    seatIds.map((id) =>
      prisma.seat.create({
        data: { id },
      })
    )
  );

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
