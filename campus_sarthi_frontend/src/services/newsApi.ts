import api from './api';

export const newsApi = {
  getAll: (tag?: string) => api.get('/api/news/', { params: { tag: tag || undefined } }),
};
