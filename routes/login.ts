// src/routes/login.ts
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sql, UserFromDB } from "../lib/db";

export const loginRouter = Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const users: UserFromDB[] = await sql<
      UserFromDB[]
    >`SELECT * FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
