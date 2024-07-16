import { Router } from "express";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

//Types
type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  bookmarks: string[]
};

type DB = {
  users: User[];
};

// Helper function
function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

// Default values for our user
const defaultUser: User = {
    uuid: "",
    firstName: "unknown",
    lastName: "unknown",
    email: "no@mail",
    password: "ChangeMe123!" ,
    profileImg: "",
    bookmarks: []
};

// Router
export const loginRouter = Router();

// Get DataBase
loginRouter.get("/", (_, res) => {
  const db = getDB();
  res.json(db.users);
});

// Add to Database
loginRouter.post("/", (req, res) => {
    // Generate uuid
    const uuid = uuidv4();
    const newUser: User = {
        // Fill in values of the defaultUser
        ...defaultUser,
        // Fill in values from the request
        ...req.body,
        // fill in generated uuid
        uuid: uuid
    };
    const db = getDB();
    const updatedDb = {
    // All entries from our database
      ...db,
    // Plus our updated List of Users together with the newly created one
      users: [...db.users, newUser],
    };
    //Write File
    fs.writeFileSync("./db.json", JSON.stringify(updatedDb, null, 2));
    // If successful, give Status 200 for completed and the uuid as a log
    res.status(200).json({ id: newUser.uuid });
  });
