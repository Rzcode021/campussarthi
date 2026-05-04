import api from './api';

export const adminApi = {
  getStats: () => api.get('/api/admin/stats/'),
  // Users
  getPendingUsers: () => api.get('/api/admin/users/pending/'),
  getAllUsers: (role?: string, includeAdmin?: boolean) =>
    api.get('/api/admin/users/', { params: { role, include_admin: includeAdmin } }),
  approveUser: (id: number) => api.post(`/api/admin/users/${id}/approve/`),
  rejectUser: (id: number) => api.delete(`/api/admin/users/${id}/reject/`),
  updateUserRole: (id: number, role: string) =>
    api.patch(`/api/admin/users/${id}/role/`, { role }),
  toggleUserActive: (id: number) =>
    api.post(`/api/admin/users/${id}/toggle-active/`),
  deleteUser: (id: number) =>
    api.delete(`/api/admin/users/${id}/delete/`),
  // Companies
  getAdminCompanies: (status?: string) =>
    api.get('/api/admin/companies/', { params: { status } }),
  createCompany: (data: Record<string, unknown>) =>
    api.post('/api/admin/companies/', data),
  updateCompany: (id: number, data: Record<string, unknown>) =>
    api.put(`/api/admin/companies/${id}/`, data),
  approveCompany: (id: number) => api.post(`/api/admin/companies/${id}/approve/`),
  rejectCompany: (id: number) => api.post(`/api/admin/companies/${id}/reject/`),
  getDrafts: () => api.get('/api/admin/companies/', { params: { status: 'draft' } }),
  getDraftResume: (id: number) => api.get(`/api/admin/companies/draft/${id}/`),
  saveDraft: (data: Record<string, unknown>) => api.post('/api/admin/companies/draft/', data),
  // Study Materials
  getAdminStudyMaterials: (status?: string) =>
    api.get('/api/admin/study-materials/', { params: { status } }),
  uploadStudyMaterial: (formData: FormData) =>
    api.post('/api/admin/study-materials/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  approveStudyMaterial: (id: number) =>
    api.post(`/api/admin/study-materials/${id}/approve/`),
  rejectStudyMaterial: (id: number) =>
    api.post(`/api/admin/study-materials/${id}/reject/`),
  deleteStudyMaterial: (id: number) =>
    api.delete(`/api/admin/study-materials/${id}/`),
  // Crew
  getAdminCrew: () => api.get('/api/admin/crew/'),
  createCrewMember: (data: FormData | Record<string, unknown>) =>
    api.post('/api/admin/crew/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
  updateCrewMember: (id: number, data: FormData | Record<string, unknown>) =>
    api.put(`/api/admin/crew/${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
  deleteCrewMember: (id: number) => api.delete(`/api/admin/crew/${id}/`),
  // News
  getAdminNews: () => api.get('/api/admin/news/'),
  createNewsArticle: (data: Record<string, unknown>) =>
    api.post('/api/admin/news/', data),
  updateNewsArticle: (id: number, data: Record<string, unknown>) =>
    api.put(`/api/admin/news/${id}/`, data),
  deleteNews: (id: number) => api.delete(`/api/admin/news/${id}/`),
  publishNews: (id: number) => api.post(`/api/admin/news/${id}/publish/`),
  // Resources
  getAdminResources: () => api.get('/api/admin/resources/'),
  createResource: (data: Record<string, unknown>) =>
    api.post('/api/admin/resources/', data),
  updateResource: (id: number, data: Record<string, unknown>) =>
    api.put(`/api/admin/resources/${id}/`, data),
  deleteResource: (id: number) => api.delete(`/api/admin/resources/${id}/`),
  activateResource: (id: number) => api.post(`/api/admin/resources/${id}/activate/`),
  // Study Materials
  rejectMaterialWithReason: (id: number, reason: string) =>
    api.post(`/api/admin/study-materials/${id}/reject/`, { reason }),
};
