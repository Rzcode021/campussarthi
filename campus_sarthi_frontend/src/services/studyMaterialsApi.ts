import api from './api';

export const studyMaterialsApi = {
  getAll: (category?: string) =>
    api.get('/api/study-materials/', { params: { category: category || undefined } }),
  download: (id: number) =>
    api.get(`/api/study-materials/${id}/download/`),
  getMyMaterials: () =>
    api.get('/api/study-materials/my-materials/'),
};
