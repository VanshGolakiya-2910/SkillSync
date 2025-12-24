import fs from "fs";
import { Project } from "../models/project.model.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const updateProjectImages = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const files = req.files;
  const { existingPhotos = [] } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  let finalImages = [];

  try {
    /* ---------------- Keep images user did NOT remove ---------------- */
    if (Array.isArray(existingPhotos)) {
      finalImages = existingPhotos.filter(
        (url) => typeof url === "string" && url.startsWith("http")
      );
    }

    /* ---------------- Append new uploads ---------------- */
    if (files?.projectPhotos?.length) {
      for (const file of files.projectPhotos) {
        const result = await uploadOnCloudinary(file.path);
        if (!result?.secure_url) {
          throw new ApiError(500, "Failed to upload image");
        }
        finalImages.push(result.secure_url);
      }
    }

    if (!finalImages.length) {
      throw new ApiError(400, "Project must have at least one image");
    }

    project.projectPhotos = finalImages;
    await project.save();
  } finally {
    /* ---------------- Cleanup temp files ---------------- */
    if (files?.projectPhotos) {
      for (const file of files.projectPhotos) {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { project },
      "Project images updated successfully"
    )
  );
});

export { updateProjectImages };


const updateProjectVideo = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const files = req.files;

  if (!files?.projectVideo?.[0]?.path) {
    throw new ApiError(400, "No video provided");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const videoPath = files.projectVideo[0].path;

  try {
    const result = await uploadOnCloudinary(videoPath);
    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload video");
    }

    project.projectVideo = result.secure_url;
    await project.save();
  } finally {
    // ✅ cleanup temp file
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { project },
      "Project video updated successfully"
    )
  );
});

export { updateProjectImages, updateProjectVideo };
