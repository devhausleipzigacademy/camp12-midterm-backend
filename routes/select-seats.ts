import { Router } from "express";
import fs from "fs";

type Screening = {
  id: string;
  date: string;
  time: string;
  bookedSeats: string[];
};

type DB = {
  screening: Screening[];
};

function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  // creating object out of string with JSON.parse
  return JSON.parse(dbFile) as DB;
}

export const seatsRouter = Router();

seatsRouter.get("/:screeningId", (req, res) => {
  const { screeningId } = req.params;
  const db = getDB();
  const screening = db.screening.find((s) => s.id === screeningId);

  if (!screening) {
    return res.status(404).json({ message: "Screening not found" });
  }

  res.json({ blockedSeats: screening.bookedSeats });
});
