import { prisma } from "../lib/db";

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screening.deleteMany();

  // Seed users
  const users = [
    {
      email: "dan@devhausleipzig.de",
      firstName: "Dan",
      lastName: "McAtee",
      password: "test123",
    },
    {
      email: "taylor@devhausleipzig.de",
      firstName: "Taylor",
      lastName: "Harvey",
      password: "test123",
    },
    {
      email: "franz@devhausleipzig.de",
      firstName: "Franz",
      lastName: "Wollang",
      password: "test123",
    },
    {
      email: "nikita@devhausleipzig.de",
      firstName: "Nikita",
      lastName: "Nakropin",
      password: "test123",
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }

  // Seed bookmarks
  const bookmarks = [
    {
      movieId: "653346",
      user: { connect: { id: createdUsers[0].id } },
    },
    {
      movieId: "653346",
      user: { connect: { id: createdUsers[2].id } },
    },
    {
      movieId: "653346",
      user: { connect: { id: createdUsers[0].id } },
    },
    {
      movieId: "693134",
      user: { connect: { id: createdUsers[1].id } },
    },
    {
      movieId: "693134",
      user: { connect: { id: createdUsers[0].id } },
    },
  ];

  for (const bookmark of bookmarks) {
    await prisma.bookmark.create({ data: bookmark });
  }

  // Seed seats
  const seatIds = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
  for (const seatId of seatIds) {
    await prisma.seat.create({ data: { id: seatId } });
  }

  // Seed screenings with seats
  const screenings = [
    {
      date: new Date("2024-07-16T17:00:00Z"),
      time: new Date("2024-07-16T17:00:00Z"),
      seats: {
        create: [
          { seat: { connect: { id: "A1" } } },
          { seat: { connect: { id: "A2" } } },
          { seat: { connect: { id: "A3" } } },
        ],
      },
    },
    {
      date: new Date("2024-07-16T20:00:00Z"),
      time: new Date("2024-07-16T20:00:00Z"),
      seats: {
        create: [
          { seat: { connect: { id: "B1" } } },
          { seat: { connect: { id: "B2" } } },
          { seat: { connect: { id: "B3" } } },
        ],
      },
    },
  ];

  for (const screening of screenings) {
    await prisma.screening.create({ data: screening });
  }
}

main().then(() => process.exit(0));
