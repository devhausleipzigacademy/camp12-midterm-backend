import { Router } from "express";
import { prisma } from "../lib/db";
import { z, ZodError } from "zod";
import { isValidSeats } from "../lib/seats";

type Screening = {
  id: string;
  date: string;
  time: string;
  bookedSeats: string[];
};

type DB = {
  screening: Screening[];
};

export const reservationsRouter = Router();

const reservationSchema = z.object({
  screeningId: z.string(),
  userId: z.string(),
  bookedSeats: z
    .array(z.string())
    .refine((seats) => isValidSeats(seats), { message: "Seats not valid" }),
});

reservationsRouter.post("/select-seats-reservation", async (req, res) => {
  try {
    const reservation = reservationSchema.parse(req.body);

    // check if screening for id exists
    const screening = await prisma.screening.findUnique({
      where: {
        id: reservation.screeningId,
      },
      include: {
        reservations: true,
      },
    });
    if (!screening) {
      return res.status(400).json({ error: "No Screening found" });
    }
    // check if user for id exists
    const userExist = await prisma.user.findUnique({
      where: {
        id: reservation.userId,
      },
    });
    if (!userExist) {
      return res.status(400).json({ error: "No User found" });
    }

    const seats = screening.reservations
      .map((reservation) => reservation.bookedSeats)
      .flat();

    if (seats.some((seat) => reservation.bookedSeats.includes(seat))) {
      return res
        .status(400)
        .json({ error: "At least one of the seats is already booked" });
    }

    const newReservation = await prisma.reservation.create({
      data: reservation,
      include: {
        screening: true,
      },
    });

    return res.status(201).json({
      message: "Reservation process Successfully",
      reservation: newReservation,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: err.issues });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // if (!reservation) {
  //   return res.status(404).json({ message: "Screening not found" });
  // }

  // Check for already booked seats
  // const alreadyBookedSeats = seats.filter((seat: string) =>
  //   screening.bookedSeats.includes(seat)
  // );

  // if (alreadyBookedSeats.length > 0) {
  //   return res
  //     .status(409)
  //     .json({ message: "Some seats are already booked", alreadyBookedSeats });
  // }

  // // Add new seats to the bookedSeats array
  // screening.bookedSeats.push(...seats);
});
