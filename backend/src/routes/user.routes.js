import express from "express";
import {
  getUser,
  getUserById,
  changeAvatar,
  updateUserProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {avatarUploadOptions } from "../constant.js"

const router = express.Router();
router.get("/me", VerifyJWT, getUser);
router.get("/:id", VerifyJWT, getUserById);
router.post(
  "/uploadAvatar",
  VerifyJWT,
  upload.fields([
    avatarUploadOptions
  ]),
  changeAvatar
);
router.post("/updateUserProfile", VerifyJWT, updateUserProfile);
router.post("/changePassword", VerifyJWT, changePassword);


export default router;
