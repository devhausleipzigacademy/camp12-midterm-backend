import { PrismaClient } from "@prisma/client";
import postgres from "postgres";

export const sql = postgres({
  host: "127.0.0.1",
  db: "postgres",
  user: "user",
  password: "password",
});

export const prisma = new PrismaClient();
