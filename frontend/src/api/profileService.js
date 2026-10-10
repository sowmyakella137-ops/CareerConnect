import api from './api.js';

export const profileService = {
  /**
   * Fetch current authenticated user's profile
   */
  async getMyProfile() {
    const response = await api.get('/api/profiles/me');
    return response.data;
  },

  /**
   * Create or update the authenticated user's profile
   * @param {Object} profileData - { education, skills, interests, bio, resumeUrl }
   */
  async updateProfile(profileData) {
    const response = await api.post('/api/profiles', profileData);
    return response.data;
  },
};

export default profileService;
