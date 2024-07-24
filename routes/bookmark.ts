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
    // get whole bookmark table with user info
    // res.json(bookmarks);
    // Only movieIds
    const movieIds = bookmarks.map(bookmark => bookmark.movieId);
    res.json(movieIds);
  }
  catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});