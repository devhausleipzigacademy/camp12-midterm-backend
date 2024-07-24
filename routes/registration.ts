import { Router } from "express";
import fs, { stat } from "fs";
import { v4 as uuidv4 } from "uuid";
import { z, ZodError } from "zod";
import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

//Types
type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  bookmarks: string[];
};

type DB = {
  users: User[];
};

// Helper function
function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}

// Router
export const registrationRouter = Router();

// Get DataBase
registrationRouter.get("/", (_, res) => {
  const db = getDB();
  res.json(db.users);
});

const RegisterUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password has to be at least 6 characters long"),
});

// Add to Database
registrationRouter.post("/", async (req, res) => {
  const body = req.body;
  try {
    const user = RegisterUserSchema.parse(body);
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    return res.json({ user: newUser });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});
