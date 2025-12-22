import express from "express";
import {
  addProject,
  getAllProjects,
  getProjectByID,
  deleteProject,
  updateProject,
  updateTags,
  updateTechStack,
  updateVisibility,
  discoverProjects,
} from "../controllers/project.controller.js";

import { VerifyJWT, VerifyOwnership } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { photoUploadOptions, videoUploadOptions } from "../constant.js";

const router = express.Router();

/* -------------------- CREATE -------------------- */
router.post(
  "/addProject",
  VerifyJWT,
  upload.fields([photoUploadOptions, videoUploadOptions]),
  addProject
);

/* -------------------- OWNER DASHBOARD -------------------- */
// Logged-in user → all their projects (public + private)
router.get("/getAllProjects", VerifyJWT, getAllProjects);

/* -------------------- PUBLIC DISCOVERY -------------------- */
// Anyone (logged in or not) → ONLY public projects
router.get("/discover", discoverProjects);

/* -------------------- PROJECT BY ID -------------------- */
// Access rules handled inside controller
router
  .route("/:id")
  .get(VerifyJWT, getProjectByID)
  .patch(VerifyJWT, VerifyOwnership, updateProject)
  .delete(VerifyJWT, VerifyOwnership, deleteProject);

/* -------------------- GRANULAR UPDATES -------------------- */
router.patch("/:id/tags", VerifyJWT, VerifyOwnership, updateTags);
router.patch("/:id/techStack", VerifyJWT, VerifyOwnership, updateTechStack);

/* -------------------- VISIBILITY -------------------- */
// Public / Private toggle (owner only)
router.patch(
  "/:id/visibility",
  VerifyJWT,
  VerifyOwnership,
  updateVisibility
);

export default router;
