import api from './api.js';

export const applicationService = {
  /**
   * View the authenticated student's applications
   */
  async getMyApplications() {
    const response = await api.get('/api/applications/me');
    return response.data;
  },

  /**
   * Apply to an internship
   * @param {string|number} internshipId
   * @param {Object} applicationData - optional notes or cover letter
   */
  async applyToInternship(internshipId, applicationData = {}) {
    try {
      // Primary standard endpoint
      const response = await api.post(`/api/internships/${internshipId}/apply`, applicationData);
      return response.data;
    } catch (err) {
      // Fallback endpoint if backend mapped POST /api/applications with { internshipId }
      if (err.response && (err.response.status === 404 || err.response.status === 405)) {
        const response = await api.post('/api/applications', {
          internshipId,
          ...applicationData,
        });
        return response.data;
      }
      throw err;
    }
  },

  /**
   * View applications received by the authenticated company
   */
  async getCompanyApplications() {
    const response = await api.get('/api/applications/company');
    return response.data;
  },

  /**
   * Update an application's status (Company role)
   * Valid backend statuses typically: 'APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'
   * @param {string|number} applicationId
   * @param {string} status
   */
  async updateApplicationStatus(applicationId, status) {
    const response = await api.patch(`/api/applications/${applicationId}/status`, { status });
    return response.data;
  },
};

export default applicationService;
