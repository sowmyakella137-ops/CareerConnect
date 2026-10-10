import api from './api.js';

export const internshipService = {
  /**
   * Browse all internships with optional search or skill filter
   * @param {Object} params - { search, skill }
   */
  async getInternships(params = {}) {
    const response = await api.get('/api/internships', { params });
    return response.data;
  },

  /**
   * Get single internship details by ID
   * @param {string|number} id
   */
  async getInternshipById(id) {
    const response = await api.get(`/api/internships/${id}`);
    return response.data;
  },

  /**
   * Post a new internship (Company role)
   * @param {Object} data - { title, description, requiredSkills, location, stipend, etc. }
   */
  
async createInternship(data) {
  const payload = {
    ...data,
    requiredSkills: Array.isArray(data.requiredSkills)
      ? data.requiredSkills.join(', ')
      : data.requiredSkills
  };

  const response = await api.post('/api/internships', payload);
  return response.data;
},


  /**
   * Get internships posted by the currently authenticated company
   */
  async getCompanyInternships() {
    try {
      const response = await api.get('/api/internships/company');
      return response.data;
    } catch {
      // Fallback: fetch all and filter client side if backend uses query
      const response = await api.get('/api/internships');
      return response.data;
    }
  },
};

export default internshipService;
