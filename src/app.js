import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config();


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// ---------- Import Routes ----------
import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

// ---------- Use Routes ----------
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/reservations", reservationRoutes);

export default app;