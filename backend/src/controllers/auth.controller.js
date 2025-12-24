import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import emailService from "../services/email.service.js";
import * as crypto from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    // Call instance methods on the document
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  if (req.cookies.accessToken) {
    throw new ApiError(
      403,
      "You are already signed in. Logout before creating a new account."
    );
  }
  const { username, email, password, fullname } = req.body;

  if (
    [username, email, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const newUser = await User.create({
    username,
    email,
    password,
    fullname,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully"));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "All fields required");
  }
  if (!username && !email) {
    throw new ApiError(400, "Username nad email are requried");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) throw new ApiError(404, "User does not exist");

  const isPassowordValid = await user.isPasswordCorrect(password);

  if (!isPassowordValid) throw new ApiError(401, "Invaild User Credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successful"
      )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
  await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "No user found with this email");

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save({ validateBeforeSave: false });
  const resetLink = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/reset-password/${resetToken}`;

  try {
    await emailService.sendPasswordResetEmail(
      user.email,
      resetLink,
      user.username
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          process.env.NODE_ENV === "development"
            ? { resetToken, resetLink }
            : {},
          "Password reset link sent to email"
        )
      );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(
      500,
      "There was an error sending the email. Try again later."
    );
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword)
    throw new ApiError(400, "Token and new password are required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  console.log(user.resetPasswordToken , user.resetPasswordExpires)
  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password has been reset successfully"));
});

export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };
