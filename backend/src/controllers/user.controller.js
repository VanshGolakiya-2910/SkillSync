import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

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

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { username, email, fullname } = req.body;

  if (!user) throw new ApiError(401, "Unauthorized");

  if (!username && !email && !fullname) {
    throw new ApiError(400, "Enter at least one field to update");
  }
  if (username) user.username = username;
  if (email) user.email = email;
  if (fullname) user.fullname = fullname;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile updated successfully"));
});

const changePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { password, newPassword } = req.body;

  if (!password) throw new ApiError(400, "Enter the old password");
  if (!newPassword) throw new ApiError(400, "Enter the new password");

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(401, "Unauthorized");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Password updated successfully"));
});

export { getUser, changeAvatar, updateUserProfile, changePassword };
