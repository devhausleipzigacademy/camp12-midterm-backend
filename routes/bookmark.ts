import { Router } from "express";
import fs from "fs";
import { sql } from "../lib/db"

type User = {
  id: string;
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

bookmarkRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookmarks = await sql`
      SELECT *
      FROM users 
      LEFT JOIN bookmarks
      ON users.id = bookmarks.user_id
      WHERE user_id = ${userId}
    `;
    // remove .movie_id to see joined table, else you will see only the (string)array of the movie_ids
    res.json(bookmarks.map(bookmark => bookmark.movie_id));
  }
  catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookmarkRouter.post("/:uuid/:movieId", (req, res) => {
  const db = getDB();
  const uuid = req.params.uuid;
  const movieId = req.params.movieId;
  const userIndex = db.users.findIndex(u => u.id === uuid);

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