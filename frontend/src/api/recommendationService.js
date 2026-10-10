import api from './api.js';

export const recommendationService = {
  /**
   * Fetch ranked internship recommendations based on student's skills
   * Response contains: { studentSkills, recommendations: [...] }
   */
  async getRecommendations() {
  try {
    const response = await api.get('/api/recommendations/internships');
    return response.data;
  } catch (err) {
    // 404 = student has no profile yet, so there are no recommendations
    if (err.response && err.response.status === 404) {
      return { studentSkills: [], recommendations: [] };
    }
    throw err;
  }
},

  /**
   * Fetch specific skill matching comparison for an internship
   * @param {string|number} internshipId
   * Response contains: { studentSkills, requiredSkills, matchedSkills, missingSkills, matchPercentage }
   */
  async getSkillMatching(internshipId) {
    const response = await api.get(`/api/skill-matching/internships/${internshipId}`);
    return response.data;
  },
};

export default recommendationService;
