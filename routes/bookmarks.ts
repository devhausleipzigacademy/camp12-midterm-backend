import { Router } from "express";
import fs from "fs";


type User = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    profileImg: string,
    bookmarks: string[]
  };

  type Screening = {
          id: string,
          date: string,
          time: string,
          bookedSeats: string[]
  }
  
  type DB = {
    users: User[];
    screening: Screening[]
  };
  
  function getDB() {
    const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
    return JSON.parse(dbFile) as DB;
  }

export const bookmarksRouter = Router();


bookmarksRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const user = getDB().users.find(user => user.id === id);

    if (user) {
      res.json(user.bookmarks);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
