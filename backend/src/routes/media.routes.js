import express from 'express'
import {updateProjectImages , updateProjectVideo } from '../controllers/media.controller.js'
import { VerifyJWT, VerifyOwnership } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import {photoUploadOptions , videoUploadOptions } from '../constant.js'

const router = express.Router()

router.patch(
  "/:id/images",
  VerifyJWT,
  VerifyOwnership,
  upload.fields([photoUploadOptions]),
  updateProjectImages
);

router.patch(
  "/:id/video",
  VerifyJWT,
  VerifyOwnership,
  upload.fields([videoUploadOptions]),
  updateProjectVideo
);

export default router