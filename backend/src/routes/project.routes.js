import express from "express";
import {
  addProject,
  getAllProjects,
  getProjectByID,
  deleteProject,
  updateProject,
  updateTags,
  updateTechStack,
} from "../controllers/project.controller.js";
import { VerifyJWT, VerifyOwnership } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {photoUploadOptions , videoUploadOptions }from "../constant.js";

const router = express.Router();

router.post(
  "/addProject",
  VerifyJWT,
  upload.fields([photoUploadOptions, videoUploadOptions]),
  addProject
);

router.get("/getAllProjects", VerifyJWT, getAllProjects);

router
  .route("/:id")
  .get(VerifyJWT, getProjectByID)
  .patch(VerifyJWT, VerifyOwnership, updateProject)
  .delete(VerifyJWT, VerifyOwnership, deleteProject);

router.patch("/:id/tags" , VerifyJWT , VerifyOwnership, updateTags)
router.patch("/:id/techStack" , VerifyJWT , VerifyOwnership, updateTechStack)

export default router;
