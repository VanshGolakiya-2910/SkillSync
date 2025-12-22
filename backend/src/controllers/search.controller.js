import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Project } from "../models/project.model.js";

const searchUserById = asyncHandler(async (req, res) => {
  const { id: searchId } = req.params;

  if (!searchId) throw new ApiError(400, "Search ID is required");

  const user = await User.findById(searchId).select(
    "username fullname avatar email"
  );

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User found successfully"));
});

/**
 * Unified search handler for users, projects, or both.
 * Supports pagination via `page` and `limit` query/body params.
 * Params (query or body):
 * - q: search term (required)
 * - type: 'users' | 'projects' | 'all' (defaults to 'all')
 * - page: page number (1-based, defaults to 1)
 * - limit: results per page (defaults to 10)
 *
 * Pagination explanation:
 * - `page` is 1-based (page=1 returns the first set of results).
 * - `limit` defines how many items are returned per page.
 * - `skip` is calculated as (page - 1) * limit and tells MongoDB how many
 *   documents to skip before starting to return results.
 * - `countDocuments` is used to get the total number of matching documents so
 *   the API can calculate `totalPages` and include `totalResults` in the response.
 */
const search = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) throw new ApiError(400, "Query parameter `q` is required");

  const regex = { $regex: q, $options: "i" };

  const users = await User.find({
    $or: [
      { username: regex },
      { fullname: regex },
      { email: regex },
    ],
  }).select("username fullname avatar email");

  const projects = await Project.find({
    $or: [
      { title: regex },
      { description: regex },
      { tags: regex },
      { techStack: regex },
    ],
  });

  const results = [
    ...users.map(u => ({
      ...u.toObject(),
      type: "user",
    })),
    ...projects.map(p => ({
      ...p.toObject(),
      type: "project",
    })),
  ];

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Search completed"));
});

export { searchUserById, search };
