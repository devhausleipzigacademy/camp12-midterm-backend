import { Router } from "express";
import fs from "fs";

type Screening = {
  id: string;
  date: string;
  time: string;
  bookedSeats: string[];
};

const SeatsTotal = 44;

function getDB() {
  const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
  return JSON.parse(dbFile);
}

export const timesRouter = Router();

timesRouter.get("/", (_, res) => {
  const db = getDB();
  console.log(db);

  const availableTimes = db.screening
    .filter((screening: Screening) => screening.bookedSeats.length < SeatsTotal)
    .map((screening: Screening) => screening.time);

  res.json(availableTimes);
});
