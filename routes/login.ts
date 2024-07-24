import { Router } from "express";
import fs from "fs";
import { User } from "../lib/types";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";

type DB = {
  users: User[];
  screening: [];
};

// checking the contents of the DB
function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile) as DB;
}
// Router
export const loginRouter = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password needs to be at least 6 characters"),
});

// Comparing data from login to db
loginRouter.post("/", async (req, res) => {
  const data = req.body;
  try {
    const { email, password } = LoginSchema.parse(data);
    const exisitingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!exisitingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatches = await bcrypt.compare(
      password,
      exisitingUser.password
    );
    if (!passwordMatches) {
      res.status(400).json({ error: "Password is incorrect" });
    }
    res.json({ message: "Password matches" });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});
