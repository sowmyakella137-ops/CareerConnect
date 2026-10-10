import api from './api.js';

export const authService = {
  /**
   * Register a new student account
   * @param {Object} data - { name, email, password, etc. }
   */
  async registerStudent(data) {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Register a new company account
   * @param {Object} data - { companyName / name, email, password, etc. }
   */
  async registerCompany(data) {
    const response = await api.post('/api/auth/register/company', data);
    return response.data;
  },

  /**
   * Login user (Student, Company, or Admin)
   * @param {Object} credentials - { email / username, password }
   */
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
};

export default authService;
