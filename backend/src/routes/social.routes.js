import express from "express";
import {
  followUser,
  acceptRequest,
  getAllFollowers,
  getAllFollowing,
  getAllRequested,
} from "../controllers/social.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";
import { checkFollowAvailability } from "../middleware/social.middleware.js";

const router = express.Router();

router.get("/:id/followers", VerifyJWT, getAllFollowers);
router.get("/:id/following", VerifyJWT, getAllFollowing);
router.get("/requested", VerifyJWT, getAllRequested);

router.post("/:id/follow", VerifyJWT, checkFollowAvailability, followUser);
router.post("/:id/accept", VerifyJWT, acceptRequest);

export default router;
