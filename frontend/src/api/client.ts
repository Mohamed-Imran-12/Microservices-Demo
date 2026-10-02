import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth');
  if (stored) {
    try {
      const auth = JSON.parse(stored);
      if (auth?.jwt) {
        config.headers.Authorization = `Bearer ${auth.jwt}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

// Handle 401 → clear auth and redirect to login
// Skip redirect for the login endpoint itself so LoginPage can show an error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url ?? '';
    const isLoginEndpoint = requestUrl.includes('/login') || requestUrl.includes('/register');
    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
