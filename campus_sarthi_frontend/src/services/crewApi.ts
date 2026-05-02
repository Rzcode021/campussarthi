import api from './api';

export const crewApi = {
  getAll: () => api.get('/api/crew/'),
  getMyRatings: () => api.get('/api/crew/my-ratings/'),
  submitRating: (crewId: number, data: { stars: number; comment: string }) =>
    api.post(`/api/crew/${crewId}/rate/`, data),
};
