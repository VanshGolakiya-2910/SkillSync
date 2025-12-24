import fs from "fs";
import { Project } from "../models/project.model.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image

const updateProjectImages = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const files = req.files;
  const existingPhotos = req.body['existingPhotos[]'] || req.body.existingPhotos || [];

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  let finalImages = [];

  try {
    /* ---------------- Keep existing images ---------------- */
    // Handle both array and single value cases
    let existingPhotosList = [];
    if (Array.isArray(existingPhotos)) {
      existingPhotosList = existingPhotos;
    } else if (existingPhotos) {
      existingPhotosList = [existingPhotos];
    }

    // Filter valid URLs
    finalImages = existingPhotosList.filter(
      (url) => typeof url === "string" && url.startsWith("http")
    );

    /* ---------------- Validate and upload new images ---------------- */
    if (files?.photos?.length) {
      // Validate image sizes
      for (const file of files.photos) {
        if (file.size > MAX_IMAGE_SIZE) {
          throw new ApiError(400, `Image ${file.originalname} exceeds 5MB limit`);
        }
      }

      // Upload new images
      for (const file of files.photos) {
        const result = await uploadOnCloudinary(file.path);
        if (!result?.secure_url) {
          throw new ApiError(500, `Failed to upload image: ${file.originalname}`);
        }
        finalImages.push(result.secure_url);
      }
    }

    /* ---------------- Validate at least one image ---------------- */
    if (!finalImages.length && !files?.photos?.length) {
      // Allow empty if new images are being uploaded
      if (!files?.photos) {
        throw new ApiError(400, "Project must have at least one image");
      }
    }

    project.projectPhotos = finalImages;
    await project.save();
  } finally {
    /* ---------------- Cleanup temp files ---------------- */
    if (files?.photos) {
      for (const file of files.photos) {
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

const updateProjectVideo = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const files = req.files;

  if (!files?.video?.[0]?.path) {
    throw new ApiError(400, "No video provided");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const videoFile = files.video[0];
  const videoPath = videoFile.path;

  try {
    // Validate video size
    if (videoFile.size > MAX_VIDEO_SIZE) {
      throw new ApiError(400, `Video exceeds 100MB limit. Current size: ${(videoFile.size / (1024 * 1024)).toFixed(2)}MB`);
    }

    const result = await uploadOnCloudinary(videoPath);
    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload video");
    }

    project.projectVideo = result.secure_url;
    await project.save();
  } finally {
    // Cleanup temp file
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

