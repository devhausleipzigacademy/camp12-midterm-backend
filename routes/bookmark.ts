import { Router } from "express";
import fs from "fs";
import { sql } from "../lib/db";

type User = {
  id: string;
  bookmarks: string[];
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
bookmarkRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookmarks =
      await sql`SELECT * FROM users JOIN bookmarks ON users.id = bookmarks.user_id WHERE user_id = ${userId}`;
    // remove .movie_id to see joined table, else you will see only the (string)array of the movie_ids
    res.json(bookmarks.map((bookmark) => bookmark.movie_id));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookmarkRouter.post("/:movieId/:userId", async (req, res) => {
  const movieId = req.params.movieId;
  const userId = req.params.userId;

  try {
    // Check if the user exists
    const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie ID is already in the user's bookmarks
    const bookmark =
      await sql`SELECT * FROM bookmarks WHERE user_id = ${userId} AND movie_id = ${movieId}`;
    if (bookmark) {
      // If it exists, remove it
      await sql`DELETE FROM bookmarks WHERE user_id = ${userId} AND movie_id = ${movieId}`;
    } else {
      // If it doesn't exist, add it
      await sql`INSERT INTO bookmarks (user_id, movie_id) VALUES (${userId}, ${movieId})`;
    }

    // Get the updated user with bookmarks
    const updatedUser =
      await sql`SELECT u.*, b.movie_id AS bookmarks FROM users u LEFT JOIN bookmarks b ON u.id = b.user_id WHERE u.id = ${userId}`;
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
