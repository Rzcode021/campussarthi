import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let _getToken: (() => string | null) | null = null;
let _logout: (() => void) | null = null;

export const setApiTokenGetter = (getter: () => string | null) => { _getToken = getter; };
export const setApiLogout = (logout: () => void) => { _logout = logout; };

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = _getToken ? _getToken() : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _logout) {
      _logout();
    }
    return Promise.reject(error);
  }
);

export default api;
