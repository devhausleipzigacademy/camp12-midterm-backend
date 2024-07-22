import { Router } from "express";
import { prisma } from "../lib/db";

export const seatsRouter = Router();

seatsRouter.get("/:screeningId", async (req, res) => {
  const { screeningId } = req.params;
  try {
    const screening = await prisma.screening.findUnique({
      where: {
        id: screeningId,
      },
      include: { seats: true },
    });

    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }
    const seats = screening.seats;
    res.json({ screening, seats });
  } catch (error) {
    console.error("Error fetching screening and seats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
