import { Router } from "express";
import { prisma } from "../lib/db"

export const bookmarkRouter = Router();

bookmarkRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // check if there is user found
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if thats the case, then look for the bookmarks
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId
      },
      include: {
        user: true
      }
    });
    const movieIds = bookmarks.map(bookmark => bookmark.movieId);
    res.json(movieIds);
  }
  catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookmarkRouter.post("/:userId/:movieId", async (req, res) => {
  const userId = req.params.userId;
  const movieId = req.params.movieId;

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
      where: { movieId_userId: { movieId, userId } },
    });
    if (bookmark) {
      // If it exists, remove it
      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });
    } else {
      // If it doesn't exist, add it
      await prisma.bookmark.create({
        data: { movieId, userId },
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
