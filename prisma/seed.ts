import { prisma } from "../lib/db";
import { User, Game, Prisma } from "@prisma/client";

async function main() {
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();

  const users: Prisma.UserCreateInput[] = [
    {
      email: "dan@devhausleipzig,.de",
      firstName: "Dan",
      lastName: "McAtee",
      password: "test123",
    },
    {
      email: "taylor@devhausleipzig,.de",
      firstName: "Taylor",
      lastName: "Harvey",
      password: "test123",
    },
    {
      email: "franz@devhausleipzig,.de",
      firstName: "Franz",
      lastName: "Wollang",
      password: "test123",
    },
  ];

  const games: Prisma.GameCreateInput[] = [
    { name: "MTG Arena" },
    { name: "Pokemon GO" },
    { name: "Minecraft" },
    { name: "Elder Scrolls Online" },
  ];

  const screenings: Prisma.ScreeningCreateInput[] = [
    {
      id: "e72f636c-7bcb-4c35-8b77-c1c066f9b0a1",
      date: "24-07-2024",
      time: "10:00",
      booked_seats: "A1,B1,C1,D1,E1,F1",
      movie_id: "movie1-id",
    },
    {
      id: "7e2b8f26-2365-4a2b-bde6-41c5c9e5f2b9",
      date: "24-07-2024",
      time: "14:00",
      booked_seats: "A2,B2,C2,D2,E2,F2",
      movie_id: "movie2-id",
    },
    {
      id: "3e3d1a43-0a6a-4cb3-8e6b-fb7ef3fae6f4",
      date: "25-07-2024",
      time: "16:00",
      booked_seats: "A3,B3,C3,D3,E3,F3",
      movie_id: "movie3-id",
    },
    {
      id: "18b6fc79-9b1f-4d9f-9f37-f87c8c15e4b2",
      date: "26-07-2024",
      time: "18:00",
      booked_seats: "A4,B4,C4,D4,E4,F4",
      movie_id: "movie4-id",
    },
    {
      id: "d12a5c7c-60d8-4f82-86ea-5d81cfa7f8a5",
      date: "27-07-2024",
      time: "20:00",
      booked_seats: "A5,B5,C5,D5,E5,F5",
      movie_id: "movie5-id",
    },
    {
      id: "8c3bda85-7de5-4e0d-9a60-292baf644c36",
      date: "25-07-2024",
      time: "12:00",
      booked_seats:
        "A1,B1,C1,D1,E1,F1,A2,B2,C2,D2,E2,F2,A3,B3,C3,D3,E3,F3,A4,B4,C4,D4,E4,F4,A5,B5,C5,D5,E5,F5,A6,B6,C6,D6,E6,F6",
      movie_id: "movie6-id",
    },
    {
      id: "b4e4c947-d501-45d7-bce2-ea207f10b589",
      date: "25-08-2024",
      time: "15:00",
      booked_seats:
        "A1,B1,C1,D1,E1,F1,A2,B2,C2,D2,E2,F2,A3,B3,C3,D3,E3,F3,A4,B4,C4,D4,E4,F4,A5,B5,C5,D5,E5,F5,A6,B6,C6,D6,E6,F6",
      movie_id: "movie7-id",
    },
    {
      id: "2bfa545d-4e3c-45f6-9451-b6f5f7a6c9e2",
      date: "01-09-2024",
      time: "21:00",
      booked_seats:
        "A1,B1,C1,D1,E1,F1,A2,B2,C2,D2,E2,F2,A3,B3,C3,D3,E3,F3,A4,B4,C4,D4,E4,F4,A5,B5,C5,D5,E5,F5,A6,B6,C6,D6,E6,F6",
      movie_id: "movie8-id",
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  for (const game of games) {
    await prisma.game.create({ data: game });
  }
  for (const screening of screenings) {
    await prisma.screening.create({ data: screening });
  }
}

main().then(() => process.exit(0));
