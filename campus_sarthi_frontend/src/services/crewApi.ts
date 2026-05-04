import api from './api';
import axios from 'axios';

const PUBLIC_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Public axios instance — no auth token needed
const publicApi = axios.create({ baseURL: PUBLIC_BASE });

export const crewApi = {
  // Authenticated endpoints (still used by admin)
  getAll: () => api.get('/api/crew/'),
  getMyRatings: () => api.get('/api/crew/my-ratings/'),
  submitRating: (crewId: number, data: { stars: number; comment: string }) =>
    api.post(`/api/crew/${crewId}/rate/`, data),

  // Public endpoints (no login required)
  getAllPublic: () => publicApi.get('/api/crew/'),
  submitPublicRating: (crewId: number, data: { stars: number; comment: string; name: string; year: string; branch: string }) =>
    publicApi.post(`/api/crew/${crewId}/rate/`, data),
};

export const placementFamilyApi = {
  // Public — no auth
  getAll: () => publicApi.get('/api/crew/placement-family/'),

  // Admin — requires auth
  adminGetAll: () => api.get('/api/admin/placement-family/'),
  create: (formData: FormData) =>
    api.post('/api/admin/placement-family/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: number, formData: FormData) =>
    api.put(`/api/admin/placement-family/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: number) => api.delete(`/api/admin/placement-family/${id}/`),
};
