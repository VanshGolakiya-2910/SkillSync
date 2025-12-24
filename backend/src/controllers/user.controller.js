import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
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

  return res.status(200).json(
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

  return res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
  );
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

  const user = await User.findById(id).select(
    '-password -refreshToken'
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Optional: respect profile visibility
  if (user.isProfilePublic === false) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        'User profile fetched successfully'
      )
    );
});


export {
  getUser,
  changeAvatar,
  updateUserProfile,
  changePassword,
  getUserById,
};