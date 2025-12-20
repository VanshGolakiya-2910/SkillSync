import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import {Project } from "../models/project.model.js"


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



const searchUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) throw new ApiError(400, "Username is required");

  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }).select("username fullname avatar email");

  if (!users || users.length === 0)
    throw new ApiError(404, "No users found with that username");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalResults: users.length, users },
        "Users found successfully"
      )
    );
});

const searchProjectsByTitle = asyncHandler(async(req , res , next) =>{
    const { title } = req.body 
    if(!title) throw new ApiError(400 ,"Enter the field")

  const projects = await Project.find({
    title: { $regex: title, $options: "i" },
  });

    if(!projects || projects.length === 0) throw new ApiError(400, "Project not found")
    
     return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalResults: projects.length, projects },
        "Projects found successfully"
      )
    );
})

const globalSearch = asyncHandler(async(req , res ,next) => {
  const {type , field , id, title , username } =req.params
  if(!type || !field) throw new ApiError("Add atleast one field")

  if(type === "project"){
    const project  = Project.aggregate({
      $match :  [{title}]
    })
    
  }
    if(type === ""){
    const project  = Project.aggregate({
      $match :  [{title}]
    })
    
  }
})

export { searchUserById, searchUserByUsername };
