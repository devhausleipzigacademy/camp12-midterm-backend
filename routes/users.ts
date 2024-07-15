import { Router } from "express";
import fs from "fs";

type User = {
  username: string;
  firstName: string;
  lastName: string;
};

type DB = {
  users: User[];
};

function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

export const usersRouter = Router();

usersRouter.get("/", (_, res) => {
  const db = getDB();
  res.json(db.users);
});

usersRouter.get("/:username", (req, res) => {
  const { username } = req.params;
  const db = getDB();
  const user = db.users.find((user) => user.username === username);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});
