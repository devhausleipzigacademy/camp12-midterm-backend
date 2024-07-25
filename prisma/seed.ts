import { connect } from "http2";
import { prisma } from "../lib/db";
import { User, Prisma } from "@prisma/client";

async function main() {
  await prisma.user.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.bookmark.deleteMany();

  const users: Prisma.UserCreateInput[] = [
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
    console.log(`USER ID: ${createdUser.id}`)
  }

  const bookmarks: Prisma.BookmarkCreateInput[] = [
    { 
      movieId: "653346", 
      user: { connect: { id: createdUsers[0].id } }
    },
    { 
      movieId: "653346", 
      user: { connect: { id: createdUsers[2].id } }
    },
    { 
      movieId: "693134", 
      user: { connect: { id: createdUsers[1].id } }
    },
    { 
      movieId: "693134", 
      user: { connect: { id: createdUsers[0].id } }
    },
  ];

  const screenings: Prisma.ScreeningCreateInput[] = [
    {
      date: "24-07-2024",
      time: "10:00",
      bookedSeats: ["A1", "B1", "C1", "D1", "E1", "F1"],
      movieId: "movie1-id",
    },
    {
      date: "24-07-2024",
      time: "14:00",
      bookedSeats: ["A2", "B2", "C2", "D2", "E2", "F2"],
      movieId: "movie2-id",
    },
    {
      date: "25-07-2024",
      time: "16:00",
      bookedSeats: ["A3", "B3", "C3", "D3", "E3", "F3"],
      movieId: "movie3-id",
    },
    {
      date: "26-07-2024",
      time: "18:00",
      bookedSeats: ["A4", "B4", "C4", "D4", "E4", "F4"],
      movieId: "movie4-id",
    },
    {
      date: "27-07-2024",
      time: "20:00",
      bookedSeats: ["A5", "B5", "C5", "D5", "E5", "F5"],
      movieId: "movie5-id",
    },
    {
      date: "25-07-2024",
      time: "12:00",
      bookedSeats: [
        "A1",
        "B1",
        "C1",
        "D1",
        "E1",
        "F1",
        "A2",
        "B2",
        "C2",
        "D2",
        "E2",
        "F2",
        "A3",
        "B3",
        "C3",
        "D3",
        "E3",
        "F3",
        "A4",
        "B4",
        "C4",
        "D4",
        "E4",
        "F4",
        "A5",
        "B5",
        "C5",
        "D5",
        "E5",
        "F5",
        "A6",
        "B6",
        "C6",
        "D6",
        "E6",
        "F6",
      ],
      movieId: "movie6-id",
    },
    {
      date: "25-08-2024",
      time: "15:00",
      bookedSeats: [
        "A1",
        "B1",
        "C1",
        "D1",
        "E1",
        "F1",
        "A2",
        "B2",
        "C2",
        "D2",
        "E2",
        "F2",
        "A3",
        "B3",
        "C3",
        "D3",
        "E3",
        "F3",
        "A4",
        "B4",
        "C4",
        "D4",
        "E4",
        "F4",
        "A5",
        "B5",
        "C5",
        "D5",
        "E5",
        "F5",
        "A6",
        "B6",
        "C6",
        "D6",
        "E6",
        "F6",
      ],
      movieId: "movie7-id",
    },
    {
      date: "01-09-2024",
      time: "21:00",
      bookedSeats: [
        "A1",
        "B1",
        "C1",
        "D1",
        "E1",
        "F1",
        "A2",
        "B2",
        "C2",
        "D2",
        "E2",
        "F2",
        "A3",
        "B3",
        "C3",
        "D3",
        "E3",
        "F3",
        "A4",
        "B4",
        "C4",
        "D4",
        "E4",
        "F4",
        "A5",
        "B5",
        "C5",
        "D5",
        "E5",
        "F5",
        "A6",
        "B6",
        "C6",
        "D6",
        "E6",
        "F6",
      ],
      movieId: "movie8-id",
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  for (const screening of screenings) {
    await prisma.screening.create({ data: screening });
  }

  for (const bookmark of bookmarks) {
    await prisma.bookmark.create({ data: bookmark });
  }


}

main().then(() => process.exit(0));
