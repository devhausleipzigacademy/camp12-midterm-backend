import { Router } from "express";
import fs from "fs";

type User = {
  uuid: string;
  bookmarks: string[]
};

type DB = {
  users: User[];
};

function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

export const bookmarkRouter = Router();

// Sen User with bookmarks back
bookmarkRouter.get("/:uuid", (req, res) => {
  const db = getDB();
  const uuid = req.params.uuid
  const user = db.users.find(u => u.uuid === uuid)
  res.json(user);
});

bookmarkRouter.post("/:uuid/:movieId", (req, res) => {
  const db = getDB();
  const uuid = req.params.uuid
  const movieId = req.params.movieId
  const user = db.users.find(u => u.uuid === uuid)

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const updatedDb = {
    // All entries from our database
      ...db,
    // Plus our updated List of Users together with the newly created one
      users: [...db.users, newUser],
    };
    //Write File
    fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));

  if (user.bookmarks.includes(movieId)) {
    // Entfernt das spezifische movieId aus den Bookmarks
    user.bookmarks = user.bookmarks.filter(id => id !== movieId);
    res.status(200).json(Number(user.bookmarks));
  } else {
    // Fügt das spezifische movieId zu den Bookmarks hinzu
    user.bookmarks.push(movieId);
    res.status(202).json(Number(user.bookmarks));
  }
});

