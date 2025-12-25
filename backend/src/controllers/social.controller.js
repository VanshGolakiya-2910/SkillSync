import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import mongoose from "mongoose";

//followUser & AcceptUser logic : followID comes from the params and userID from the verifyJWT
//      : after that compare and add in the requested or follow or follower as per the requirement

//getFollowers and getFollowing   : get without checking for auth
//getRequested : check user from cookies and only get the users requested

const followUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { id: followId } = req.params;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!followId) throw new ApiError(400, "Follow ID is required");

  const followUser = await User.findById(followId);
  if (!followUser) throw new ApiError(404, "User not found");

  user.following = user.following || [];
  followUser.requested = followUser.requested || [];

  if (user.following.includes(followId))
    throw new ApiError(400, "Already following this user");

  user.following.push(followId);
  followUser.requested.push(user._id);

  await user.save();
  await followUser.save();

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Follow request sent successfully"));
});

const acceptRequest = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { id: followId } = req.params;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!followId) throw new ApiError(400, "Follow ID is required");

  const followUser = await User.findById(followId);
  if (!followUser) throw new ApiError(404, "User not found");

  user.requested = user.requested || [];
  user.followers = user.followers || [];

  user.requested = user.requested.filter(
    (id) => id.toString() !== followId.toString()
  );

  if (!user.followers.includes(followId)) {
    user.followers.push(followId);
  }

  followUser.following = followUser.following || [];
  if (!followUser.following.includes(user._id)) {
    followUser.following.push(user._id);
  }

  await user.save();
  await followUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Follow request accepted"));
});

const getAllFollowers = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!userId) throw new ApiError(400, "User ID is required");

if (!mongoose.Types.ObjectId.isValid(userId)) {
  throw new ApiError(400, 'Invalid user id');
}


  const user = await User.findById(userId)
    .populate({
      path: "followers",
      select: "name username avatar",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    })
    .lean();

  if (!user) throw new ApiError(404, "User not found");

  const totalCount = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $project: {
        count: {
          $size: { $ifNull: ["$followers", []] },
        },
      },
    },
  ]);

  const followersCount = totalCount[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentPage: page,
        totalPages: Math.ceil(followersCount / limit),
        followersCount,
        followers: user.followers,
      },
      "Followers fetched successfully"
    )
  );
});

const getAllFollowing = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!userId) throw new ApiError(400, "User ID is required");

  if (!mongoose.Types.ObjectId.isValid(userId)) {
  throw new ApiError(400, 'Invalid user id');
}
  const user = await User.findById(userId)
    .populate({
      path: "following",
      select: "name username avatar",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    })
    .lean();

  if (!user) throw new ApiError(404, "User not found");

  const totalCount = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $project: {
        count: {
          $size: { $ifNull: ["$following", []] },
        },
      },
    },
  ]);

  const followingCount = totalCount[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentPage: page,
        totalPages: Math.ceil(followingCount / limit),
        followingCount,
        following: user.following,
      },
      "Followers fetched successfully"
    )
  );
});

const getAllRequested = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(req.user._id)
    .populate("requested", "name username avatar")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const requestedUsers = user.requested || [];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRequested: requestedUsers.length,
        requestedUsers,
      },
      "Fetched all follow requests"
    )
  );
});

export {
  followUser,
  acceptRequest,
  getAllFollowers,
  getAllFollowing,
  getAllRequested,
};
