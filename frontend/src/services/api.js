import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const analyzeMessage = async (text) => {
  const response = await api.post('/api/analyze/message', { text });
  return response.data;
};

export const analyzeUrl = async (url) => {
  const response = await api.post('/api/analyze/url', { url });
  return response.data;
};

export const analyzeImage = async (formData) => {
  const response = await api.post('/api/analyze/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getScans = async (limit = 50) => {
  const response = await api.get(`/api/scans?limit=${limit}`);
  return response.data;
};

export const getScanById = async (id) => {
  const response = await api.get(`/api/scans/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export default api;
