import { Router } from "express";
import { prisma } from "../lib/db";

type User = {
  id: string;
  bookmarks: string[];
};

export const bookmarkRouter = Router();

// Send User with bookmarks back
bookmarkRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  // get existing user bookmarks
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: { movieId: true },
    });
    res.json(bookmarks.map((bookmark) => bookmark.movieId));
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie ID is already in the user's bookmarks
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId, movieId },
    });
    if (bookmark) {
      // If it exists, remove it
      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });
    } else {
      // If it doesn't exist, add it
      await prisma.bookmark.create({
        data: { userId, movieId },
      });
    }

    // Get the updated user with bookmarks
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { bookmarks: { select: { movieId: true } } },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
