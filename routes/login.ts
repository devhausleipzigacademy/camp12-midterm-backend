import { Router } from "express";
import fs from "fs";
import { User } from "../lib/types";

type DB = {
  users: User[];
  screening: [];
};

// checking the contents of the DB
function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}
// Router
export const loginRouter = Router();

// Comparing data from login to db
loginRouter.post("/", (req, res) => {
  // creating loginEmail & loginPassword
  const { loginEmail, loginPassword } = req.body;
  const db = getDB();
  // finding userEmail
  const user = db.users.find((user) => user.email === loginEmail);
  // when user doesnt exist: 404
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  //  when user password doesnt match loginPassword
  if (loginPassword !== user.password) {
    return res.status(401).json({ message: "Wrong Password" });
  }
  // if successfull:
  return res.status(200).json({ user: user });
});
