import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";


const send_reservation = async (req, res, next) => {
  const { date, time } = req.body;
  
  // User is authenticated, get info from req.user
  if (!req.user) {
    return next(new ErrorHandler("Please login to make a reservation", 401));
  }

  if (!date || !time) {
    return next(new ErrorHandler("Please provide date and time!", 400));
  }

  try {
    await Reservation.create({ 
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,
      date, 
      time,
      user: req.user._id 
    });
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle other errors
    return next(error);
  }
};


const get_all_reservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

const update_reservation_status = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "accepted", "declined"].includes(status)) {
    return next(new ErrorHandler("Invalid status. Must be pending, accepted, or declined", 400));
  }

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    res.status(200).json({
      success: true,
      message: `Reservation ${status} successfully!`,
      reservation,
    });
  } catch (error) {
    return next(error);
  }
};

export default send_reservation;
export { get_all_reservations, update_reservation_status };

