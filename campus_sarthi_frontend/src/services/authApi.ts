import api from './api';
import { useAppStore } from '../store/useAppStore';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login/', { email, password }),

  /**
   * Register a new user.
   * - Posts to Django backend (which persists to DB and shows in admin panel).
   * - Also adds to Zustand store for instant local preview.
   * - Does NOT swallow errors: if backend fails, the error propagates to the form.
   */
  register: async (data: Record<string, unknown>) => {
    // Let backend errors propagate — DO NOT catch here
    const res = await api.post('/api/auth/register/', data);

    // If backend registration succeeded, also mirror in store for local admin preview
    useAppStore.getState().addAccessRequest({
      id: Date.now(),
      userId: Date.now() + 1,
      userName: String(data.full_name ?? ''),
      email: String(data.email ?? ''),
      status: 'pending',
      timestamp: new Date().toISOString(),
    });

    return res;
  },

  me: () => api.get('/api/auth/me/'),

  updateProfile: (data: FormData | Record<string, unknown>) =>
    api.put('/api/auth/profile/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
};
