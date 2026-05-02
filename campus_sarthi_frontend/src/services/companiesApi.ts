import api from './api';

export const companiesApi = {
  getAll: (domain?: string, search?: string) =>
    api.get('/api/companies/', { params: { domain: domain || undefined, search: search || undefined } }),
  getById: (id: number) => api.get(`/api/companies/${id}/`),
};
