import axios from 'axios';

// Create an Axios instance with our base URL
// Because of the Vite proxy, /api automatically goes to localhost:3001
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ────────────────────────────────────
// Runs before EVERY outgoing request
// Automatically pulls the token from localStorage and adds it
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('coc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────
// Runs when EVERY response comes back
// If we get a 401 (unauthorized), token is expired — log the user out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('coc_token');
      localStorage.removeItem('coc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
