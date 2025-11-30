import { Reservation } from "../models/reservation.model.js";
import { Showtime } from "../models/showtime.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// -------------------- Create Reservation --------------------
export const createReservation = asyncHandler(async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user._id;

    // Check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
        throw new ApiError(404, "Showtime not found");
    }

    // Calculate how many seats are already booked
    const result = await Reservation.aggregate([
        { $match: { showtimeId: showtime._id } },
        { $group: { _id: null, totalSeats: { $sum: "$seats" } } }
    ]);

    const totalReservedSeats = result[0]?.totalSeats || 0;
    const availableSeats = showtime.capacity - totalReservedSeats;

    // Check seat availability
    if (seats > availableSeats) {
        throw new ApiError(400, "Not enough available seats");
    }

    // Create reservation
    const reservation = await Reservation.create({
        userId,
        showtimeId,
        seats
    });

    return res
        .status(201)
        .json(new ApiResponse(201, reservation, "Reservation created"));
});


// -------------------- Get User Reservations --------------------
export const getUserReservations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const reservations = await Reservation.find({ userId })
        .populate("showtimeId");

    return res
        .status(200)
        .json(new ApiResponse(200, reservations, "User reservations fetched"));
});


// -------------------- Get Reservations for a Showtime (Admin) --------------------
export const getShowtimeReservations = asyncHandler(async (req, res) => {
    const { showtimeId } = req.params;

    const reservations = await Reservation.find({ showtimeId })
        .populate("userId", "name email")
        .populate("showtimeId", "capacity date time");

    // Seat count
    const result = await Reservation.aggregate([
        { $match: { showtimeId: new mongoose.Types.ObjectId(showtimeId) } },
        { $group: { _id: null, totalSeats: { $sum: "$seats" } } }
    ]);

    const totalSeatsReserved = result[0]?.totalSeats || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            reservations,
            totalSeatsReserved,
            capacity: reservations[0]?.showtimeId?.capacity,
            revenue: totalSeatsReserved * 10   // assuming ticket price = 10
        }, "Showtime reservations fetched")
    );
});


// -------------------- Cancel Reservation --------------------
export const cancelReservation = asyncHandler(async (req, res) => {
    const { reservationId } = req.params;
    const userId = req.user._id;

    const reservation = await Reservation.findOne({
        _id: reservationId,
        userId
    });

    if (!reservation) {
        throw new ApiError(404, "Reservation not found");
    }

    // Check if showtime is in the future
    const showtime = await Showtime.findById(reservation.showtimeId);

    if (new Date(showtime.date) <= new Date()) {
        throw new ApiError(400, "Cannot cancel past or ongoing reservations");
    }

    await reservation.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Reservation cancelled"));
});
