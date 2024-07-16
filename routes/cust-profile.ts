import { Router } from "express";
import fs from "fs";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: string;
  bookmarks: string[];
};

type DB = {
  users: User[];
};

export const customisationRouter = Router();

function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

customisationRouter.patch("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);

  const updatedContents = req.body;
  const db = getDB();

  // finding user
  const user = db.users.find((user) => user.id === id);
  // when user doesnt exist: 404
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedDb = {
    ...db,
    users: db.users.map((user) => {
      if (user.id !== id) return user;
      return {
        ...user,
        ...updatedContents,
      };
    }),
  };
  const updatedUser = updatedDb.users.find((user) => {
    user.id === id;
  });
  fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));
  res.status(204).json({ user: updatedUser });
});
