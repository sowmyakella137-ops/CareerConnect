import axios from 'axios';

// Base URL for the Java Spring Boot REST API
// Defaults to http://localhost:1234 as required by the backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach JWT bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 unauthenticated and extract clean error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('careerconnect_token');
        localStorage.removeItem('careerconnect_user');
        // Notify via custom window event so AuthContext can handle logout gracefully
        window.dispatchEvent(new Event('careerconnect:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a human-readable error message from an Axios error
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.response.status === 400) return 'Invalid request data. Please check your input.';
    if (error.response.status === 401) return 'Session expired or invalid credentials. Please log in again.';
    if (error.response.status === 403) return 'You do not have permission to perform this action.';
    if (error.response.status === 404) return 'Requested resource was not found.';
    if (error.response.status === 409) return 'A conflict occurred (e.g. email or record already exists).';
    if (error.response.status === 413) return 'File too large. Maximum allowed size is 5 MB.';
    if (error.response.status >= 500) return 'Internal server error from Spring Boot backend. Please try again later.';
    return `Server error (${error.response.status})`;
  }

  if (error.request) {
    return `Cannot connect to the backend server at ${API_BASE_URL}. Ensure your Spring Boot backend is running on port 1234 and CORS allows requests from this origin.`;
  }

  return error.message || 'Network error';
};

export default api;
