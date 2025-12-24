import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

const checkFollowAvailability = asyncHandler(async (req, _, next) => {
  const user = req.user;
  const { id: followId } = req.params; 

  if (!user) throw new ApiError(400, "User not found in middleware");
  if (!followId) throw new ApiError(400, "Enter followId");

  if (user._id.toString() === followId)
    throw new ApiError(400, "You cannot follow yourself");

  const followUser = await User.findById(followId);
  if (!followUser)
    throw new ApiError(404, "Respected user not found");

  if (user.following?.includes(followId))
    throw new ApiError(400, "You are already following this user");

  next();
});

export { checkFollowAvailability };
