import { Router } from "express";
import { prisma } from "../lib/db";

export const reservationsRouter = Router();

reservationsRouter.post("/select-seats-reservation", async (req, res) => {
  const { screeningId, seats } = req.body;

  if (!screeningId || !seats) {
    return res.status(400).json({ message: "Missing screeningId or seats" });
  }

  try {
    // Get the current booked seats
    const screening = await prisma.screening.findUnique({
      where: { id: screeningId },
      include: { seats: { select: { seatId: true } } },
    });

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }

    const bookedSeatsArray = screening.seats.map(
      (screeningSeat) => screeningSeat.seatId
    );

    // Check for already booked seats
    const alreadyBookedSeats = seats.filter((seat: string) =>
      bookedSeatsArray.includes(seat)
    );

    if (alreadyBookedSeats.length > 0) {
      return res
        .status(409)
        .json({ message: "Some seats are already booked", alreadyBookedSeats });
    }

    // Check if the seats exist
    const existingSeats = await prisma.seat.findMany({
      where: {
        id: {
          in: seats,
        },
      },
    });

    const nonExistingSeats = seats.filter(
      (seat: string) => !existingSeats.some((s) => s.id === seat)
    );

    if (nonExistingSeats.length > 0) {
      return res
        .status(404)
        .json({ message: "Some seats do not exist", nonExistingSeats });
    }

    // Add the new seats to the screening
    await prisma.screening.update({
      where: { id: screeningId },
      data: {
        seats: {
          create: seats.map((seat: string) => ({
            seat: { connect: { id: seat } },
          })),
        },
      },
    });

    res.status(201).json({ message: "Seats reserved successfully" });
  } catch (error) {
    console.error("Error reserving seats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
