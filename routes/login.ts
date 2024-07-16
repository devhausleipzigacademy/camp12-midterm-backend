import { Router } from "express";
import fs from "fs";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: string;
  bookmarks: string;
};

type DB = {
  users: User[];
  screening: [];
};

// checking the contents of the DB
function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

export const loginRouter = Router();

loginRouter.get("/", (_, res) => {
  const db = getDB();
  res.json(db.users);
});

loginRouter.post("/", (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  console.log(loginEmail);
  console.log(loginPassword);
  const db = getDB();
  const user = db.users.find((user) => user.email === loginEmail);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (loginPassword !== user.password) {
    return res.status(401).json({ message: "Wrong Password" });
  }
  return res.status(200).json({ message: `Welcome ${user.firstName}` });
});
