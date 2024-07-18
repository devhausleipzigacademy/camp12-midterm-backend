import { Router } from "express";
import fs from "fs";
import { sql } from "../lib/db";
import { addDays, eachDayOfInterval, format } from "date-fns";

const SeatsTotal = 44;

type ScreeningFromDB = {
  id: number;
  date: string;
  time: string;
  booked_seats: string;
  movie_id: string;
};

export const timesRouter = Router();

timesRouter.get("/", async (req, res) => {
  const today = new Date();

  const unformattedDatesNextWeek = eachDayOfInterval({
    start: new Date(today),
    end: new Date(addDays(today, 6)),
  });

  const datesNextWeek = unformattedDatesNextWeek.map((date) =>
    format(date, "dd-MM-yyyy")
  );

  const screenings = await sql<
    ScreeningFromDB[]
  >`SELECT * FROM screenings WHERE date IN ${sql(datesNextWeek)}`;

  const availableTimes = screenings.reduce<{ [key: string]: string[] }>(
    (acc, screening) => {
      if (!acc[screening.date]) {
        acc[screening.date] = [];
      }

      if (screening.booked_seats.split(",").length < SeatsTotal) {
        acc[screening.date].push(screening.time);
      }

      return acc;
    },
    {}
  );
  res.json(availableTimes);
});
