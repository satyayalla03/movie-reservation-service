import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    seats: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required: true
    }
},{timestamps: true})


export const Reservation = mongoose.model("Reservation", reservationSchema);