import express from "express";
import { VerifyJWT , checkLogin} from "../middleware/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register",checkLogin ,registerUser);
router.post("/login", checkLogin ,loginUser);
router.post("/forgot-password",checkLogin ,forgotPassword);
router.post("/reset-password", checkLogin ,resetPassword);
router.post("/logout", VerifyJWT, logoutUser);

export default router;
