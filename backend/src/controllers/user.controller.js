import fs from "fs";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Project } from "../models/project.model.js";

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) throw new ApiError(401, "Unauthorized");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  const files = req.files;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!files?.avatar?.[0]?.path) {
    throw new ApiError(400, "No avatar file provided");
  }

  const avatarPath = files.avatar[0].path;

  try {
    const result = await uploadOnCloudinary(avatarPath);

    if (!result?.secure_url) {
      throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }

    user.avatar = result.secure_url;
    await user.save();
  } finally {
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: user.avatar },
        "Avatar updated successfully"
      )
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const allowedFields = [
    "bio",
    "location",
    "website",
    "github",
    "linkedin",
    "isProfilePublic",
  ];

  let updated = false;

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
      updated = true;
    }
  });

  // Username update
  if (req.body.username && req.body.username !== user.username) {
    user.username = req.body.username;
    updated = true;
  }

  if (!updated) {
    throw new ApiError(400, "No valid fields provided to update");
  }

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Username already taken");
    }
    throw err;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password) throw new ApiError(400, "Enter the old password");
  if (!newPassword) throw new ApiError(400, "Enter the new password");

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(401, "Unauthorized");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  user.password = newPassword;
  user.refreshToken = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Optional: respect profile visibility
  if (user.isProfilePublic === false) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const getUserFeaturedProjects = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  // 1️⃣ Fetch only what we need
  const user = await User.findById(userId)
    .select("pinnedProjects")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let projects = [];
  let mode = "latest";

  // 2️⃣ If pinned exists → fetch pinned ONLY
  if (Array.isArray(user.pinnedProjects) && user.pinnedProjects.length) {
    const pinnedIds = user.pinnedProjects.slice(0, 4);

    projects = await Project.find({
      _id: { $in: pinnedIds },
      visibility: "public",
    })
      .lean();

    // Preserve pin order (IMPORTANT)
    const projectMap = new Map(
      projects.map((p) => [p._id.toString(), p])
    );

    projects = pinnedIds
      .map((id) => projectMap.get(id.toString()))
      .filter(Boolean);

    mode = "pinned";
  }

  // 3️⃣ Fallback ONLY if no pinned results
  if (!projects.length) {
    projects = await Project.find({
      owner: userId,
      visibility: "public",
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    mode = "latest";
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { projects, mode },
      "Featured projects fetched successfully"
    )
  );
});

const updatePinnedProjects = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { projectIds } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!Array.isArray(projectIds)) {
    throw new ApiError(400, "projectIds must be an array");
  }

  if (projectIds.length > 4) {
    throw new ApiError(400, "You can pin a maximum of 4 projects");
  }

  // Validate ObjectIds
  const invalidId = projectIds.find(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );
  if (invalidId) {
    throw new ApiError(400, "Invalid project id provided");
  }

  // Verify ownership of all projects
  const ownedProjectsCount = await Project.countDocuments({
    _id: { $in: projectIds },
    owner: userId,
  });

  if (ownedProjectsCount !== projectIds.length) {
    throw new ApiError(403, "You can only pin your own projects");
  }

  // Save exact order
  await User.findByIdAndUpdate(
    userId,
    { pinnedProjects: projectIds },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { pinnedProjects: projectIds },
        "Pinned projects updated successfully"
      )
    );
});

export {
  getUser,
  changeAvatar,
  getUserFeaturedProjects,
  updatePinnedProjects,
  updateUserProfile,
  changePassword,
  getUserById,
};
