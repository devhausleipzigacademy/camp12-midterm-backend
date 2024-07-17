import { Router } from "express";
import fs from "fs";
import { sql } from "../lib/db";

const SeatsTotal = 44;

// function getDB() {
//   const dbFile = fs.readFileSync("./db.json", { encoding: "utf-8" });
//   return JSON.parse(dbFile);
// }

type ScreeningFromDB = {
  id: number;
  date: string;
  time: string;
  booked_seats: string;
  movie_id: string;
};

export const timesRouter = Router();

timesRouter.get("/", async (_, res) => {
  // const db = getDB();
  // console.log(db);

  // const availableTimes = db.screening
  //   .filter((screening: Screening) => screening.bookedSeats.length < SeatsTotal)
  //   .map((screening: Screening) => screening.time);

  const screenings = await sql<ScreeningFromDB[]>`SELECT * FROM screenings`;

  const availableTimes = screenings
    .filter(
      (screening: ScreeningFromDB) =>
        screening.booked_seats.split(",").length < SeatsTotal
    )
    .map((screening: ScreeningFromDB) => screening.time);

  res.json(screenings);
});
