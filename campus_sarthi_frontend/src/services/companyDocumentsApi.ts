import api from './api';

export const companyDocumentsApi = {
  getByCompany: (companyId: number, section?: string) =>
    api.get(`/api/companies/${companyId}/documents/`, { params: { section } }),
    
  upload: (companyId: number, formData: FormData) =>
    api.post(`/api/companies/${companyId}/documents/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  download: (companyId: number, docId: number) =>
    api.get(`/api/companies/${companyId}/documents/${docId}/download/`),
    
  getMyDocuments: () =>
    api.get('/api/companies/my-documents/'),
};

export const adminDocumentsApi = {
  getAll: (params?: { status?: string; company_id?: number; section?: string }) =>
    api.get('/api/admin/company-documents/', { params }),
    
  approve: (id: number) =>
    api.post(`/api/admin/company-documents/${id}/approve/`),
    
  reject: (id: number, reason?: string) =>
    api.post(`/api/admin/company-documents/${id}/reject/`, { reason }),
    
  delete: (id: number) =>
    api.delete(`/api/admin/company-documents/${id}/`),
};
