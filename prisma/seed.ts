import { prisma } from "../lib/db";
import { User, Game, Prisma } from "@prisma/client";

async function main() {
  await prisma.user.deleteMany();
  await prisma.game.deleteMany();

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
  ];

  const games: Prisma.GameCreateInput[] = [
    { name: "MTG Arena" },
    { name: "Pokemon GO" },
    { name: "Minecraft" },
    { name: "Elder Scrolls Online" },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  for (const game of games) {
    await prisma.game.create({ data: game });
  }
}

main().then(() => process.exit(0));
