import api from './api';

/**
 * Create new project
 * POST /project/addProject
 */
export const createProject = (formData) => {
  return api.post('/project/addProject', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get all projects
 * GET /project/getAllProjects
 */
export const getAllProjects = () => {
  return api.get('/project/getAllProjects');
};

/**
 * Get single project
 * GET /project/:id
 */
export const getProjectById = (id) => {
  return api.get(`/project/${id}`);
};

/**
 * Update project
 * PATCH /project/:id
 */
export const updateProject = (id, data) => {
  return api.patch(`/project/${id}`, data);
};

/**
 * Delete project
 * DELETE /project/:id
 */
export const deleteProject = (id) => {
  return api.delete(`/project/${id}`);
};

/**
 * Update project tags
 * PATCH /project/:id/tags
 */
export const updateProjectTags = (id, tags) => {
  return api.patch(`/project/${id}/tags`, { tags });
};

/**
 * Update tech stack
 * PATCH /project/:id/techStack
 */
export const updateProjectTechStack = (id, techStack) => {
  return api.patch(`/project/${id}/techStack`, { techStack });
};
export const updateProjectVisibility = (projectId, visibility) =>
  api.patch(`/project/${projectId}/visibility`, { visibility });

export const getPublicProjects = () =>
  api.get('/project/discover');

/* ---------------- Upload Project Media ---------------- */
export const uploadProjectMedia = (projectId, formData) =>
  api.patch(
    `/project/${projectId}/media`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
