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

const changeAvatar = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const files = req.files;

  if (!user) throw new ApiError(401, "Unauthorized");

  if (!files || !files.avatar || !files.avatar[0] || !files.avatar[0].path) {
    throw new ApiError(400, "No avatar file provided");
  }

  const avatarLocalPath = files.avatar[0].path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar || !avatar.secure_url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  user.avatar = avatar.secure_url;
  await user.save();

  fs.unlinkSync(avatarLocalPath);
  // Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: avatar.secure_url },
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

export {
  getUser,
  changeAvatar,
  updateUserProfile,
  changePassword,
};