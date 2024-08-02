import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.user.deleteMany();


  // define a screening

  const screening = await prisma.screening.create({
    data: {
      id: "1c5feb0a-afaf-4ca8-a68a-5731ff1d3027",
      date: "24-06-2024",
      time: "12:30",
      movieId: "12345",
    },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("test123", salt);

  const user = await prisma.user.create({
    data: {
      id: "ddeeba94-b5a2-4eb4-8229-0b2b3630ecf3",

      email: "dan@devhausleipzig.de",
      firstName: "Dan",
      lastName: "McAtee",
      password: hashedPassword,
      reservations: {
        create: [
          {
            screeningId: screening.id,
            bookedSeats: [`A1`, `A2`],
          },
          {
            screeningId: screening.id,
            bookedSeats: [`B3`, "B4"],
          },
        ],
      },
    },
  });

  // Seed bookmarks
  const bookmarks = [
    {
      movieId: "653346",
      user: { connect: { id: user.id } },
    },
    {
      movieId: "693134",
      user: { connect: { id: user.id } },
    },
  ];


  for (const bookmark of bookmarks) {
    await prisma.bookmark.create({ data: bookmark });
  }
}

main().then(() => process.exit(0));
