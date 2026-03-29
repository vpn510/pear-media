import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
   baseURL: API_BASE,
   timeout: 120000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
   const token = localStorage.getItem('pear_token');
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem('pear_token');
         localStorage.removeItem('pear_user');
         window.location.href = '/login';
      }
      return Promise.reject(error);
   }
);

export const authAPI = {
   signup: (name, email, password) =>
      api.post('/api/auth/signup', { name, email, password }),
   login: (email, password) =>
      api.post('/api/auth/login', { email, password }),
   getMe: () => api.get('/api/auth/me'),
};

export const textAPI = {
   analyze: (text) => api.post('/api/text/analyze', { text }),
   generate: (prompt, originalText, analysis) =>
      api.post('/api/text/generate', { prompt, originalText, analysis }),
};

export const imageAPI = {
   analyze: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/api/image/analyze', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
   },
   generateVariations: (prompts) =>
      api.post('/api/image/variations', { prompts }),
};

export const healthCheck = () => api.get('/api/health');

export default api;
