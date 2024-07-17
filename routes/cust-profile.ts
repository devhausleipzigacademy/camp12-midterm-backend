import { Router } from "express";
import fs from "fs";
import { User } from "../lib/types";
import { sql } from "../lib/db";
import { UserFromDB } from "../lib/types";
import { usersRouter } from "./users";

type Created = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  avatar_image: string | null;
};

export const customizationRouter = Router();

customizationRouter.patch("/:id", async (req, res) => {
  // getting user via id
  const { id } = req.params;
  const createdContents: Created = req.body;
  const user = await sql<UserFromDB[]>`SELECT * FROM users WHERE id = ${id} `;
  console.log(user);

  const updatedUser = sql`
  update users set
  email = ${createdContents.email},
  first_name = ${createdContents.first_name},
  last_name =  ${createdContents.last_name},
  password =  ${createdContents.password},
  avatar_image =  ${createdContents.avatar_image},
  where id = ${id};
`;
  res.json(updatedUser);
  // const updatedDB = res.json(
  //   user.map((user) => ({
  //     ...user,
  //     firstName: user.first_name,
  //     lastName: user.last_name,
  //     profileImg: user.avatar_image,
  //   }))
  // );
  // console.log(seedingContents);

  // // when user doesnt exist: 404
  // if (!user) {
  //   return res.status(404).json({ message: "User not found" });
  // }

  // const updatedDb = {
  //   ...db,
  //   users: db.users.map((user) => {
  //     if (user.id !== id) return user;
  //     return {
  //       ...user,
  //       ...updatedContents,
  //     };
  //   }),
  // };
  // const updatedUser = updatedDb.users.find((user) => {
  //   user.id === id;
  // });
  // fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));
  // res.status(204).json({ user: updatedUser });
});

// usersRouter.patch("/", async (_, res) => {
//   const users = await sql<UserFromDB[]>`SELECT * FROM users;`;
//   ...db,
//   users: db.users.map((user) => {
//     if (user.id !== id) return user;
//     return {
//       ...user,
//       ...updatedContents,
//     };
//   }),
// });
