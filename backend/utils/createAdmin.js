import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.js";
import { dbConnection } from "../database/dbConnection.js";

dotenv.config({ path: "./config.env" });

const createAdmin = async () => {
  try {
    await dbConnection();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@restaurant.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@restaurant.com");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@restaurant.com",
      phone: "1234567890",
      password: "admin123", // Change this password!
      isAdmin: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@restaurant.com");
    console.log("Password: admin123");
    console.log("⚠️  Please change the password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();

