import api from './api';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login/', { email, password }),
  register: (data: Record<string, unknown>) =>
    api.post('/api/auth/register/', data),
  me: () => api.get('/api/auth/me/'),
  updateProfile: (data: Record<string, unknown>) =>
    api.put('/api/auth/profile/', data),
};
