import api from './api';

/**
 * Update project images
 * PATCH /media/:id/images
 */
export const updateProjectImages = (projectId, formData) => {
  return api.patch(`/media/${projectId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update project video
 * PATCH /media/:id/video
 */
export const updateProjectVideo = (projectId, formData) => {
  return api.patch(`/media/${projectId}/video`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};