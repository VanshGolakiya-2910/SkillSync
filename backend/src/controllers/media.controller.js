import { Project } from '../models/project.model.js'
import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
  
const updateProjectImages = asyncHandler(async (req, res, next) => {
  files = req.files;
  const { id: projectId } = req.params;
  const { existingPhotos = [] } = req.body; 

  // existingPhotos make sure that the Photos are not uploaded again to cloudinary when updating photos each time
  // alternative create a hashmap for each image and when uploading image check its hash in the hashmap if available then leave it or upload it

  if (!files || !files.projectPhotos || files.projectPhotos.length === 0) {
    throw new ApiError(400, "No new images provided");
  }

  const project = await Project.findById(projectId);
  const uploadedPhotos = [];

  if (Array.isArray(existingPhotos)) {             // checks for proper link to sanitize the uploadedImages
    uploadedPhotos.push(
      ...existingPhotos.filter((url) => url.startsWith("http"))
    );
  }

  if (files?.projectPhotos?.length) {            //req.files contains the new images that needs to be updated
    for (const file of file.projectPhotos) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.secure_url) uploadedPhotos.push(result.secure_url);
    }
  }

  if (uploadedPhotos.length === 0)
    throw new ApiError(400, "No valid project images found");

  project.projectPhotos = uploadedPhotos;  
  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        project,
        "Project images updated successfully"
      )
    );
});

const updateProjectVideo = asyncHandler(async(req, res , next)=> {
  const {id : projectId} = req.params
  const files = req.file

  const project = await Project.findById(projectId);
  if (!files || !files.projectVideo || files.projectVideo.length === 0) {
    throw new ApiError(400, "No Video provided");
  }

  let uploadedVideo = null;
  if(files?.uploadedVideo?.length){
      const result = await uploadOnCloudinary(files.path)
      if (!result?.secure_url) throw new ApiError(500, "Failed to upload video");
      uploadedVideo = result.secure_url; 
  }

  project.projectVideo = uploadedVideo;   
  await project.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        project,
        "Project Video updated successfully"
      )
    );
})
  
export  { 
    updateProjectImages,
    updateProjectVideo
}