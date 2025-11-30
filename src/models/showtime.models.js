import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    capacity: {
        type: Number, // available seats
        required: true
    },

    // each showtime is linked to a movie through movieId
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    }
}, { timestamps: true})


export const Showtime = mongoose.model("Showtime", showtimeSchema);