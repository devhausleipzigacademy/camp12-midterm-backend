import express, { NextFunction, Request, Response } from "express";
import { helloRouter } from "./routes/hello";
import { usersRouter } from "./routes/users";
import { bookmarkRouter } from "./routes/bookmark";
import { customizationRouter } from "./routes/cust-profile";
import { registrationRouter } from "./routes/registration";
import { loginRouter } from "./routes/login";
import { reservationsRouter } from "./routes/reservations";
import { timesRouter } from "./routes/times";
import { prisma, sql } from "./lib/db";
import dotenv from "dotenv";
import { seatsRouter } from "./routes/select-seats";

import cors from "cors";
import jwt from "jsonwebtoken";

const protectionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return res.status(401).json({ error: "Not authorized" });
  }

  next();
};

dotenv.config();

// Initialize application
const app = express();

app.use(cors());
app.use(express.json());

// Define an endpoint
app.use("/hello", helloRouter);
app.use("/users", protectionMiddleware, usersRouter);
app.use("/login", loginRouter);
app.use("/times", timesRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/profile", customizationRouter);
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);
app.use("/reservations", reservationsRouter);
app.use("/reserved-seats", seatsRouter);

app.get("/protected", protectionMiddleware, async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

app.get("/bookmarks", async (_, res) => {});

// Run server
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
