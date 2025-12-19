import express from "express";
import { signup, login, adminLogin, logout, getMyProfile } from "../controller/auth.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

export default router;

