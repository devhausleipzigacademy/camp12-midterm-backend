import { Router } from "express";
import { prisma } from "../lib/db";
import { z, ZodError } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required at least 2 character"),
  lastName: z.string().min(2, "Last name is required at least 2 character"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password need to be at least 6 characters long"),
});
// using the updateUserSchema for Validation
const updateUserSchema = createUserSchema.partial();

export const customizationRouter = Router();

customizationRouter.patch("/:id", async (req, res) => {
  const { id: idFromParams } = req.params;
  try {
    // Try and find user
    const existingUser = await prisma.user.findUnique({
      where: { id: idFromParams },
    });
    // If user doesn't exist, return 404
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    // If user exists, proceed with update
    const parsedBody = updateUserSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id: idFromParams },
      data: parsedBody,
    });
    // response status 200 OK
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});
