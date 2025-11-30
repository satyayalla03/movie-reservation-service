import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// ------------------ Create Movie ------------------
export const createMovie = asyncHandler(async (req, res) => {
    const { title, description, genre, posterImage } = req.body;

    if (!title || !description || !genre) {
        throw new ApiError(400, "All fields are required");
    }

    const movie = await Movie.create({
        title,
        description,
        genre,
        posterImage
    });

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "Movie created successfully"));
});


// ------------------ Get All Movies ------------------
export const getAllMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find();

    return res
        .status(200)
        .json(new ApiResponse(200, movies, "Movies fetched successfully"));
});


// ------------------ Update Movie ------------------
export const updateMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { title, description, genre, posterImage } = req.body;

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    movie.title = title;
    movie.description = description;
    movie.genre = genre;
    movie.posterImage = posterImage;

    await movie.save();

    return res
        .status(200)
        .json(new ApiResponse(200, movie, "Movie updated successfully"));
});


// ------------------ Delete Movie ------------------
export const deleteMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);

    if (!movie) {
        throw new ApiError(404, "Movie not found");
    }

    await movie.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});
