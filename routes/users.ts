import { Router } from "express";
import fs from "fs";
import { sql } from "../lib/db";
import { UserFromDB } from "../lib/types";

// function getDB() {
//   const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
//   return JSON.parse(dbFile) as DB;
// }

export const usersRouter = Router();

usersRouter.get("/", async (_, res) => {
  const users = await sql<UserFromDB[]>`SELECT * FROM users;`;
  res.json(
    users.map((user) => ({
      ...user,
      firstName: user.first_name,
      lastName: user.last_name,
      profileImg: user.avatar_image,
    }))
  );
});

// usersRouter.post("/", (req, res) => {
//   const newUser = req.body;
//   const db = getDB();
//   const updatedDb = {
//     ...db,
//     users: [...db.users, newUser],
//   };
//   fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));

//   res.status(201).json({ username: newUser.username });
// });

// usersRouter.get("/:username", (req, res) => {
//   const { username } = req.params;
//   const db = getDB();
//   const user = db.users.find((user) => user.username === username);

//   if (!user) {
//     res.status(404).json({ message: "User not found" });
//   }
//   res.json(user);
// });

// usersRouter.patch("/:username", (req, res) => {
//   const { username } = req.params;
//   const updatedContents = req.body;

//   const db = getDB();
//   const updatedDb = {
//     ...db,
//     users: db.users.map((user) => {
//       if (user.username !== username) return user;
//       return {
//         ...user,
//         ...updatedContents,
//       };
//     }),
//   };

//   const updatedUser = updatedDb.users.find(
//     (user) => user.username === username
//   );
//   fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));
//   res.status(200).json({ user: updatedUser });
// });

// usersRouter.delete("/:username", (req, res) => {
//   const { username } = req.params;
//   const db = getDB();
//   const updatedDb = {
//     ...db,
//     users: db.users.filter((user) => user.username !== username),
//   };
//   fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));

//   res.status(202).json({ username });
// });
