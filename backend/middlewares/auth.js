import { User } from "../models/user.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

export const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Please login first", 401));
  }

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("Access denied. Admin privileges required.", 403));
  }

  next();
};

