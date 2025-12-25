import express from "express";
import {
  getUser,
  getUserById,
  changeAvatar,
  updateUserProfile,
  getUserFeaturedProjects,
  updatePinnedProjects,
  changePassword,
} from "../controllers/user.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {avatarUploadOptions } from "../constant.js"

const router = express.Router();
router.get("/me", VerifyJWT, getUser);

router.patch(
  "/me/pinned-projects",
  VerifyJWT,
  updatePinnedProjects
);  
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

router.get("/:id", VerifyJWT, getUserById);
router.get("/:id/projects/featured", getUserFeaturedProjects);

export default router;
