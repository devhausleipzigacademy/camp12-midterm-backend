import { Router } from "express";
import fs from "fs";

type User = {
  uuid: string;
  bookmarks: string[]
};

type DB = {
  users: User[];
};

function getDB(): DB {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}



export const bookmarkRouter = Router();

// Send User with bookmarks back
bookmarkRouter.get("/:uuid", (req, res) => {
  const db = getDB();
  const uuid = req.params.uuid;
  const user = db.users.find(u => u.uuid === uuid);
  
  //Return 404 if no user found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user.bookmarks);
});

bookmarkRouter.post("/:uuid/:movieId", (req, res) => {
  const db = getDB();
  const uuid = req.params.uuid;
  const movieId = req.params.movieId;
  const userIndex = db.users.findIndex(u => u.uuid === uuid);

  //Return 404 if no user found
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = db.users[userIndex];

  // Has our user bookmarks array have the movieID?
  if (user.bookmarks.includes(movieId)) {
    // if so, remove it
    user.bookmarks = user.bookmarks.filter(id => id !== movieId);
  } else {
    // else add it
    user.bookmarks.push(movieId);
  }

  // Save on DB
  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
  res.status(200).json({ bookmarks: user.bookmarks });
});