import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
  withCredentials: true,
});

// Add a request interceptor to include the token in authenticated requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jira_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const exchangeCodeForToken = (code) =>
  API.post('/api/token', { code });

export const getProjects = (siteId) =>
  API.get('/api/projects', { params: { siteId } });
