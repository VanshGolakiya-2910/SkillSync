import api from './api';

/**
 * Get followers of a user
 * GET /social/:id/followers
 */
export const getFollowers = (userId) => {
  return api.get(`/social/${userId}/followers`);
};

/**
 * Get following list of a user
 * GET /social/:id/following
 */
export const getFollowing = (userId) => {
  return api.get(`/social/${userId}/following`);
};

/**
 * Get pending follow requests
 * GET /social/requested
 */
export const getFollowRequests = () => {
  return api.get('/social/requested');
};

/**
 * Send follow request
 * POST /social/:id/follow
 */
export const followUser = (userId) => {
  return api.post(`/social/${userId}/follow`);
};

/**
 * Accept follow request
 * POST /social/:id/accept
 */
export const acceptFollow = (userId) => {
  return api.post(`/social/${userId}/accept`);
};
