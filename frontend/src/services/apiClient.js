import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// 👉 interceptor para agregar el token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // ⬅️ nombre exacto

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getHealth = () => apiClient.get('/health');
