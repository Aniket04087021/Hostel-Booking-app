import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import authRouter from "./routes/authRoute.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();
dotenv.config({ path: "./config.env" });

// ✅ Allow both local and deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:5174", // if using Vite default port
  "https://hostel-booking-app-jdda.vercel.app" // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reservation", reservationRouter);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});

dbConnection();

app.use(errorMiddleware);

export default app;
