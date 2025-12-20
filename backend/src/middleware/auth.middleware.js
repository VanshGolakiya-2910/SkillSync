import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";

const VerifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req?.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) throw new ApiError(401, "Unauthorized Access");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid Access Token");
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const VerifyOwnership = asyncHandler(async (req, _, next) => {
  const user = req.user;

  if (!user) throw new ApiError(401, "Unauthorized access");

  const projectId = req.params.id || req.body.id || req.query.id;
  if (!projectId) throw new ApiError(400, "Project ID is required");

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (project.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not allowed to access this project");
  }

  next();
});

const checkLogin = asyncHandler(async (req, _, next) => {
  if (req.cookies.accessToken) {
    throw new ApiError(
      403,
      "You are already logged in. Please logout first to continue."
    );
  }
  next();
});

export { VerifyJWT, VerifyOwnership, checkLogin };
