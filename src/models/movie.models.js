import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    posterImage: {
        type: String, // URL is string, we upload using cloudinary and multer
        required: true
    },
}, {timestamps: true})


// Lets you populate all showtimes for a movie.
// i.e., for a movie, it will pull-out all showtimes

movieSchema.virtual("showtimes", {
    ref: "Showtime",           // reference model
    localField: "_id",         // movie._id
    foreignField: "movieId"    // showtime.movieId
});

// if a movie is deleted, deletes its showtimes too
// we use middleware

movieSchema.pre("findOneAndDelete", async function (next){
    try {
        const movieId = this.getQuery()["_id"];
        await mongoose.model("Showtime").deleteMany({movieId});
        next();
    } catch (err) {
        next(err);
    }
})


export const Movie = mongoose.model("Movie", movieSchema)