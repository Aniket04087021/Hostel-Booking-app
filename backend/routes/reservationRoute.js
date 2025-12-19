import express from "express";
import send_reservation, { get_all_reservations, update_reservation_status } from "../controller/reservation.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isAuthenticated, send_reservation);
router.get("/all", isAuthenticated, isAdmin, get_all_reservations);
router.patch("/update/:id", isAuthenticated, isAdmin, update_reservation_status);

export default router;
