import { Router } from "express";
import { createReservation, getUserReservations, cancelReservation, getShowtimeReservations } from "../controllers/reservation.controllers.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createReservation);
router.get("/my-reservations", verifyToken, getUserReservations);
router.delete("/:reservationId", verifyToken, cancelReservation);

router.get("/showtime/:showtimeId", verifyToken, isAdmin, getShowtimeReservations);

export default router;
