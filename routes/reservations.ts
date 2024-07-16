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
  return JSON.parse(dbFile) as DB;
}

function saveDB(db: DB) {
  fs.writeFileSync("./db.json", JSON.stringify(db, null, 2));
}

export const reservationsRouter = Router();

reservationsRouter.post("/select-seats-reservation", (req, res) => {
  const { screeningId, seats } = req.body;

  if (!screeningId || !seats) {
    return res.status(400).json({ message: "Missing screeningId or seats" });
  }

  const db = getDB();
  const screening = db.screening.find((s) => s.id === screeningId);

  if (!screening) {
    return res.status(404).json({ message: "Screening not found" });
  }

  // Check for already booked seats
  const alreadyBookedSeats = seats.filter((seat: string) =>
    screening.bookedSeats.includes(seat)
  );

  if (alreadyBookedSeats.length > 0) {
    return res
      .status(409)
      .json({ message: "Some seats are already booked", alreadyBookedSeats });
  }

  // Add new seats to the bookedSeats array
  screening.bookedSeats.push(...seats);

  // Save the updated database
  saveDB(db);

  res
    .status(201)
    .json({
      message: "Seats reserved successfully",
      bookedSeats: screening.bookedSeats,
    });
});
