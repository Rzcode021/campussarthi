import api from './api';

export const resourcesApi = {
  getAll: () => api.get('/api/resources/'),
};
