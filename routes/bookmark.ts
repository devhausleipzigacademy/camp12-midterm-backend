import { Router } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const bookmarkRouter = Router();

bookmarkRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId
      },
      include: {
        user: true
      }
    });

    if (bookmarks.length == 0 || bookmarks === null){
      return res.status(404).json({message: "User not found"})
    } 

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
/* bookmarkRouter.post("/:uuid/:movieId", (req, res) => {
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
}); */