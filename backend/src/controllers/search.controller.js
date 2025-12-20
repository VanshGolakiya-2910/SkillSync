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
  const q = (req.query.q || req.body.q || "").trim();
  const type = (req.query.type || req.body.type || "all").toLowerCase();

  // Pagination params: default page=1, limit=10
  const page = Math.max(1, parseInt(req.query.page || req.body.page || "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit || req.body.limit || "10", 10));

  // Calculate how many documents to skip. This is central to pagination.
  const skip = (page - 1) * limit;

  if (!q) throw new ApiError(400, "Query parameter `q` is required");

  const regex = { $regex: q, $options: "i" };

  const results = {};

  if (type === "users" || type === "all") {
    const userFilter = { $or: [{ username: regex }, { fullname: regex }, { email: regex }] };

    // total count for users matching the filter (used to compute total pages)
    const totalUsers = await User.countDocuments(userFilter);

    // fetch paginated user results
    const users = await User.find(userFilter)
      .select("username fullname avatar email")
      .skip(skip)
      .limit(limit);

    results.users = users;
    results.userPagination = {
      page,
      limit,
      totalResults: totalUsers,
      totalPages: Math.ceil(totalUsers / limit) || 0,
    };
  }

  if (type === "projects" || type === "all") {
    const projectFilter = {
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex },
        { techStack: regex },
      ],
    };

    // total count for projects matching the filter
    const totalProjects = await Project.countDocuments(projectFilter);

    // fetch paginated project results
    const projects = await Project.find(projectFilter).skip(skip).limit(limit);

    results.projects = projects;
    results.projectPagination = {
      page,
      limit,
      totalResults: totalProjects,
      totalPages: Math.ceil(totalProjects / limit) || 0,
    };
  }

  return res.status(200).json(new ApiResponse(200, results, "Search completed"));
});

export { searchUserById, search };
