import api from './api.js';

export const connectionService = {
  /**
   * Discover students with optional search query (skills, name, etc.)
   * @param {string} query
   */
  async discoverStudents(query = '') {
    const params = {};
    if (query && query.trim()) {
      params.query = query.trim();
    }
    const response = await api.get('/api/connections/students', { params });
    return response.data;
  },

  /**
   * View an individual student's profile by ID
   * @param {string|number} studentId
   */
  async getStudentById(studentId) {
    const response = await api.get(`/api/connections/students/${studentId}`);
    return response.data;
  },

  /**
   * Send a connection request to a student
   * @param {string|number} studentId
   */
  async sendConnectionRequest(studentId) {
    const response = await api.post(`/api/connections/students/${studentId}/request`);
    return response.data;
  },

  /**
   * View received connection requests
   */
  async getReceivedRequests() {
    const response = await api.get('/api/connections/requests/received');
    return response.data;
  },

  /**
   * View sent connection requests
   */
  async getSentRequests() {
    const response = await api.get('/api/connections/requests/sent');
    return response.data;
  },

  /**
   * Accept a connection request
   * @param {string|number} connectionId
   */
  async acceptConnectionRequest(connectionId) {
    const response = await api.patch(`/api/connections/requests/${connectionId}/accept`);
    return response.data;
  },

  /**
   * Reject a connection request
   * @param {string|number} connectionId
   */
  async rejectConnectionRequest(connectionId) {
    const response = await api.patch(`/api/connections/requests/${connectionId}/reject`);
    return response.data;
  },

  /**
   * View all accepted connections
   */
  async getConnections() {
    const response = await api.get('/api/connections');
    return response.data;
  },
};

export default connectionService;
