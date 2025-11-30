import { Router } from "express";
import { createMovie, getAllMovies, updateMovie, deleteMovie } from "../controllers/movie.controllers.js";
import { createShowtime, getShowtimesForMovie } from "../controllers/showtime.controllers.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// ----------- Movie Routes -----------
router.post("/", verifyToken, isAdmin, createMovie);
router.get("/", getAllMovies);
router.put("/:movieId", verifyToken, isAdmin, updateMovie);
router.delete("/:movieId", verifyToken, isAdmin, deleteMovie);

// ----------- Showtime Routes --------
router.post("/:movieId/showtimes", verifyToken, isAdmin, createShowtime);
router.get("/:movieId/showtimes", getShowtimesForMovie);

export default router;
