import { Router } from "express";
import { prisma } from "../lib/db";
import { ZodError, z } from "zod";
import { log } from "console";

const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required at least 2 character"),
  lastName: z.string().min(2, "Last name is required at least 2 character"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password need to be at least 6 characters long"),
});

const updateUserSchema = createUserSchema.partial();

export const usersRouter = Router();

// Get all users
usersRouter.get("/", async (_, res) => {
  const users = await prisma.user.findMany();
  const date = new Date(users[0].createdAt).toLocaleDateString();
  console.log(date);

  res.json(users);
});
usersRouter.get("/games", async (_, res) => {
  const games = await prisma.game.findMany({
    include: {
      owners: true,
    },
  });
  res.json(games);
});

usersRouter.post("/", async (req, res) => {
  try {
    const parsedBody = createUserSchema.parse(req.body);
    const newUser = await prisma.user.create({
      data: parsedBody,
      select: { id: true },
    });
    return res.json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

usersRouter.get("/:email", async (req, res) => {
  const { email: emailFromParams } = req.params;
  const user = await prisma.user.findUnique({
    where: { email: emailFromParams },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

usersRouter.delete("/:email", async (req, res) => {
  const { email: emailFromParams } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { email: emailFromParams },
    select: { id: true },
  });
  res.status(204).json(deletedUser);
});

usersRouter.patch("/:email", async (req, res) => {
  const { email: emailFromParams } = req.params;
  try {
    const parsedBody = updateUserSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { email: emailFromParams },
      data: parsedBody,
    });
    return res.json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
