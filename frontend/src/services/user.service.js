import api from './api';

/**
 * Get current logged-in user
 * GET /user/me
 */
export const getMe = () => {
  return api.get('/user/me');
};

/**
 * Update user profile
 * POST /user/updateUserProfile
 */
export const updateUserProfile = (data) => {
  return api.post('/user/updateUserProfile', data);
};

/**
 * Upload avatar
 * POST /user/uploadAvatar
 */
export const uploadAvatar = (formData) => {
  return api.post('/user/uploadAvatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Change password
 * POST /user/changePassword
 */
export const changePassword = (data) => {
  return api.post('/user/changePassword', data);
};

export const getUserById = (id) =>
  api.get(`/user/${id}`);