import { Project } from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProject = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const files = req.files;
  const { title, description, tags, techStack, visibility } = req.body;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!title || !description)
    throw new ApiError(400, "Title and description are required");

  if (!files || !files.projectPhotos || !files.projectPhotos.length) {
    throw new ApiError(400, "At least one project photo is required");
  }

  const uploadedPhotos = [];
  for (const photo of files.projectPhotos) {
    const result = await uploadOnCloudinary(photo.path);
    if (!result?.secure_url) throw new ApiError(500, "Failed to upload photo");
    uploadedPhotos.push(result.secure_url);
  }

  let uploadedVideo = null;
  if (files.projectVideo && files.projectVideo[0]?.path) {
    const result = await uploadOnCloudinary(files.projectVideo[0].path);
    if (!result?.secure_url) throw new ApiError(500, "Failed to upload video");
    uploadedVideo = result.secure_url;
  }

  const project = await Project.create({
    owner: user._id,
    title,
    description,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    techStack: techStack ? techStack.split(",").map((t) => t.trim()) : [],
    projectPhotos: uploadedPhotos,
    projectVideo: uploadedVideo,
    visibility: visibility || "public", // default
  });

  if (!project) throw new ApiError(500, "Error creating project");

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});

const getAllProjects = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) throw new ApiError(401, "Unauthorized access");

  const projects = await Project.find({ owner: user._id }).sort({
    createdAt: -1,
  });

  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found for this user");
  }

  const totalProjects = projects.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProjects,
        projects,
      },
      "Projects fetched successfully"
    )
  );
});

const getProjectByID = asyncHandler(async (req, res) => {
  const user = req.user;
  const { id: projectId } = req.params;

  const project = await Project.findById(projectId).populate(
    "owner",
    "username avatar"
  );

  if (!project) throw new ApiError(404, "Project not found");

  const isOwner = user && project.owner._id.toString() === user._id.toString();

  if (project.visibility === "private" && !isOwner) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { project }, "Project fetched successfully"));
});

const deleteProject = asyncHandler(async (req, res, next) => {
  const { id: projectId } = req.params;

  await Project.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Update at least one field");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      ...(title && { title }),
      ...(description && { description }),
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { project: updatedProject },
        "Project updated successfully"
      )
    );
});

const updateTags = asyncHandler(async (req, res, next) => {
  const { tags } = req.body;
  const user = req.user;
  const { id: projectId } = req.params;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!projectId) throw new ApiError(400, "Project ID is required");

  if (!tags || !Array.isArray(tags) || tags.length === 0)
    throw new ApiError(400, "Tags must be a non-empty array");

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (JSON.stringify(project.tags) !== JSON.stringify(tags)) {
    project.tags = tags;
    await project.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project tags updated successfully"));
});

const updateTechStack = asyncHandler(async (req, res, next) => {
  const { techStack } = req.body;
  const user = req.user;
  const { id: projectId } = req.params;

  if (!user) throw new ApiError(401, "Unauthorized");
  if (!projectId) throw new ApiError(400, "Project ID is required");

  if (!techStack || !Array.isArray(techStack) || techStack.length === 0)
    throw new ApiError(400, "Tags must be a non-empty array");

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (JSON.stringify(project.techStack) !== JSON.stringify(techStack)) {
    project.techStack = techStack;
    await project.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Project techStack updated successfully")
    );
});

const updateVisibility = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { visibility } = req.body;

  if (!["public", "private"].includes(visibility)) {
    throw new ApiError(400, "Invalid visibility value");
  }

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  project.visibility = visibility;
  await project.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, project, "Project visibility updated")
  );
});

const discoverProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ visibility: "public" })
    .sort({ createdAt: -1 })
    .populate("owner", "username avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      projects,
      "Public projects fetched successfully"
    )
  );
});


export {
  addProject,
  getAllProjects,
  getProjectByID,
  deleteProject,
  updateProject,
  updateTags,
  updateTechStack,
  updateVisibility,
  discoverProjects,
};
