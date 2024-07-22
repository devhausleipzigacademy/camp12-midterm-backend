import { connect } from "http2";
import { prisma } from "../lib/db";
import { User, Prisma } from "@prisma/client";

async function main() {
  await prisma.user.deleteMany();
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
  }

  const bookmarks: Prisma.BookmarkCreateInput[] = [
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
}

main().then(() => process.exit(0));
