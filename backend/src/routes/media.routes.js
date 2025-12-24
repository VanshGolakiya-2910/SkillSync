import { Router } from 'express';
import { updateProjectImages, updateProjectVideo } from '../controllers/media.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { VerifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Images endpoint - accepts multiple photos
router.patch(
  '/:id/images',
  VerifyJWT,
  upload.fields([{ name: 'photos', maxCount: 10 }]),
  updateProjectImages
);

// Video endpoint - accepts single video
router.patch(
  '/:id/video',
  VerifyJWT,
  upload.fields([{ name: 'video', maxCount: 1 }]),
  updateProjectVideo
);

export default router;