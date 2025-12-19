import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/features.js";

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists with this email", 400));
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    sendCookie(user, res, "User registered successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendCookie(user, res, `Welcome back, ${user.firstName}!`, 200);
  } catch (error) {
    return next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (!user.isAdmin) {
      return next(new ErrorHandler("Access denied. Admin privileges required.", 403));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendCookie(user, res, `Welcome, Admin ${user.firstName}!`, 200);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV !== "Development",
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

