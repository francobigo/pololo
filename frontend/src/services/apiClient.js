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

// 👉 interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (no autorizado) y estamos en una ruta de admin
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Solo redirigir si estamos en una ruta de admin
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        // Limpiar el token y usuario
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        
        // Redirigir al login del admin
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const getHealth = () => apiClient.get('/health');
