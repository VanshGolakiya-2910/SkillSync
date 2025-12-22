import api from './api';

/**
 * Unified search (GET)
 * Example: /search?q=react&type=project
 */
export const search = (params) => {
  return api.get('/search', { params });
};

/**
 * Unified search (POST)
 * Useful for complex filters
 */
export const searchPost = (data) => {
  return api.post('/search', data);
};

/**
 * Get user by ID
 * GET /search/user/:id
 */
export const getUserById = (userId) => {
  return api.get(`/search/user/${userId}`);
};

/**
 * Global search (users + projects)
 * @param {string} query
 */
export const searchAll = (query) => {
  return api.get(`/search?q=${encodeURIComponent(query)}`);
};