import { Showtime } from "../models/showtime.models.js";
import { Movie } from "../models/movie.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ------------------ Create Showtime ------------------
export const createShowtime = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { date, time, capacity } = req.body;

    // Check required fields
    if (!date || !time || !capacity) {
        throw new ApiError(400, "All fields (date, time, capacity) are required");
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    const showtime = await Showtime.create({
        movieId,
        date,
        time,
        capacity
    });

    return res
        .status(201)
        .json(new ApiResponse(201, showtime, "Showtime created successfully"));
});


// ------------------ Get Showtimes for a Movie ------------------
export const getShowtimesForMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const showtimes = await Showtime.find({ movieId });

    return res
        .status(200)
        .json(new ApiResponse(200, showtimes, "Showtimes fetched successfully"));
});
