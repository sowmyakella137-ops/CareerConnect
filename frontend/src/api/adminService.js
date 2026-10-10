import api from './api.js';

export const adminService = {
  /**
   * Fetch admin overview statistics
   * Returns: { totalUsers, totalStudents, totalCompanies, totalInternships, totalApplications }
   */
  async getDashboardStats() {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  /**
   * Fetch all registered users
   * Returns array of: { id, name, email, role }
   */
  async getUsers() {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  
async updateUser(id, updates) {
  const response = await api.put(`/api/admin/users/${id}`, updates);
  return response.data;
},


  /**
   * Fetch all posted internships
   * Returns array of: { id, title, requiredSkills, companyUserId, ... }
   */
  async getInternships() {
    const response = await api.get('/api/admin/internships');
    return response.data;
  },

  /**
   * Fetch all internship applications
   * Returns array of: { id, internshipId, studentUserId, status, appliedAt, ... }
   */
  async getApplications() {
    const response = await api.get('/api/admin/applications');
    return response.data;
  },
  async setUserEnabled(id, enabled) {
  const response = await api.patch(`/api/admin/users/${id}/status`, {
    enabled,
  });
  return response.data;
},
};

export default adminService;
