/**
 * API Service
 * Handles all HTTP requests to the backend using Axios
 */
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  addSkill: (skill) => api.post('/auth/skills', { skill }),
  removeSkill: (skill) => api.delete(`/auth/skills/${skill}`),
  getNotifications: () => api.get('/auth/notifications'),
  markNotificationRead: (notificationId) => api.put(`/auth/notifications/${notificationId}`)
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters = {}) => api.get('/jobs', { params: filters }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getRecommendedJobs: () => api.get('/jobs/recommendations'),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// Schemes API
export const schemesAPI = {
  getSchemes: (filters = {}) => api.get('/schemes', { params: filters }),
  getSchemeById: (id) => api.get(`/schemes/${id}`),
  getLatestSchemes: (limit = 5) => api.get('/schemes/latest', { params: { limit } }),
  createScheme: (schemeData) => api.post('/schemes', schemeData),
  updateScheme: (id, schemeData) => api.put(`/schemes/${id}`, schemeData),
  deleteScheme: (id) => api.delete(`/schemes/${id}`)
};

// Resources API
export const resourcesAPI = {
  getResources: (filters = {}) => api.get('/resources', { params: filters }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  getPopularResources: (limit = 5) => api.get('/resources/popular', { params: { limit } }),
  getResourcesByCategory: (category, limit = 10) => 
    api.get(`/resources/category/${category}`, { params: { limit } }),
  createResource: (resourceData) => api.post('/resources', resourceData),
  updateResource: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  deleteResource: (id) => api.delete(`/resources/${id}`)
};

export default api;
