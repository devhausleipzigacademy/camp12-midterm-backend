import { Router } from "express";
import { addDays, eachDayOfInterval, format } from "date-fns";
import { prisma } from "../lib/db";
import { access } from "fs";

const SeatsTotal = 44;

export const timesRouter = Router();

timesRouter.get("/", async (req, res) => {
  try {
    const today = new Date();

    const unformattedDatesNextWeek = eachDayOfInterval({
      start: new Date(today),
      end: new Date(addDays(today, 6)),
    });

    const datesNextWeek = unformattedDatesNextWeek.map((date) =>
      format(date, "dd-MM-yyyy")
    );

    const screenings = await prisma.screening.findMany({
      where: {
        date: {
          in: datesNextWeek,
        },
      },
    });

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
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
