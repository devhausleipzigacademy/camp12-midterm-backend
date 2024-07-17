import { Router } from "express";
import { sql } from "../lib/db.js";

export const reservationsRouter = Router();

reservationsRouter.post("/select-seats-reservation", async (req, res) => {
  const { screeningId, seats } = req.body;

  if (!screeningId || !seats) {
    return res.status(400).json({ message: "Missing screeningId or seats" });
  }

  try {
    // Get the current booked seats
    const result = await sql`
      SELECT booked_seats 
      FROM screenings 
      WHERE id = ${screeningId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Screening not found" });
    }

    const bookedSeatsString = result[0].booked_seats;
    const bookedSeatsArray = bookedSeatsString
      ? bookedSeatsString.split(",")
      : [];

    // Check for already booked seats
    const alreadyBookedSeats = seats.filter((seat: string) =>
      bookedSeatsArray.includes(seat)
    );

    if (alreadyBookedSeats.length > 0) {
      return res
        .status(409)
        .json({ message: "Some seats are already booked", alreadyBookedSeats });
    }

    // Merge the booked seats with the new seats
    const updatedBookedSeats = [...bookedSeatsArray, ...seats].join(",");

    // Update the booked seats in the database
    await sql`
      UPDATE screenings 
      SET booked_seats = ${updatedBookedSeats}
      WHERE id = ${screeningId}
    `;

    res.status(201).json({
      message: "Seats reserved successfully",
      bookedSeats: updatedBookedSeats,
    });
  } catch (error) {
    console.error("Error reserving seats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
