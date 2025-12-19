import express from "express";
import send_reservation, { get_all_reservations, update_reservation_status } from "../controller/reservation.js";

const router = express.Router();

router.post("/send", send_reservation);
router.get("/all", get_all_reservations);
router.patch("/update/:id", update_reservation_status);

export default router;
