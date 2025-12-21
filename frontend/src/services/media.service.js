import api from './api';

/**
 * Update project images
 * PATCH /media/:id/images
 */
export const updateProjectImages = (projectId, files) => {
  const data = new FormData();

  files.forEach((file) => {
    data.append('photos', file);
  });

  return api.patch(`/media/${projectId}/images`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update project video
 * PATCH /media/:id/video
 */
export const updateProjectVideo = (projectId, file) => {
  const data = new FormData();
  data.append('video', file);

  return api.patch(`/media/${projectId}/video`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
