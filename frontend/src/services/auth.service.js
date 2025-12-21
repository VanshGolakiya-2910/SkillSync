import api from './api';

/**
 * Register new user
 * POST /auth/register
 */
export const registerUser = (data) => {
  return api.post('/auth/register', data);
};

/**
 * Login user
 * POST /auth/login
 */
export const loginUser = (data) => {
  return api.post('/auth/login', data);
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logoutUser = () => {
  return api.post('/auth/logout');
};

/**
 * Forgot password
 * POST /auth/forgot-password
 */
export const forgotPassword = (data) => {
  return api.post('/auth/forgot-password', data);
};

/**
 * Reset password
 * POST /auth/reset-password
 */
export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data);
};
