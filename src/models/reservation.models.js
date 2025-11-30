import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    seats: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required: true
    }
},{timestamps: true})


export const Reservation = mongoose.model("Reservation", reservationSchema);