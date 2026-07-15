import api from './api';
import { useAppStore } from '../store/useAppStore';

export const adminApi = {
  getStats: () => api.get('/api/admin/stats/'),

  // ── Users ──────────────────────────────────────────
  /** Returns REAL pending users from Django backend */
  getPendingUsers: () => api.get('/api/admin/users/pending/'),

  /** Returns REAL all users from Django backend */
  getAllUsers: (_role?: string, _includeAdmin?: boolean) =>
    api.get('/api/admin/users/', { params: { role: _role, include_admin: _includeAdmin } }),

  /** Approves user on BACKEND so they can login — also syncs store */
  approveUser: async (id: number) => {
    const res = await api.post(`/api/admin/users/${id}/approve/`);
    // Optimistic store update
    useAppStore.getState().updateAccessRequestStatus(id, 'approved');
    return res;
  },

  /** Rejects user on BACKEND — also syncs store */
  rejectUser: async (id: number) => {
    const res = await api.delete(`/api/admin/users/${id}/reject/`);
    useAppStore.getState().updateAccessRequestStatus(id, 'rejected');
    return res;
  },

  updateUserRole: (id: number, role: string) =>
    api.patch(`/api/admin/users/${id}/role/`, { role }),

  toggleUserActive: (id: number) =>
    api.post(`/api/admin/users/${id}/toggle-active/`),

  deleteUser: (id: number) =>
    api.delete(`/api/admin/users/${id}/delete/`),

  // ── Companies ──────────────────────────────────────
  /** Fetch companies from Django backend with Zustand store fallback */
  getAdminCompanies: async (status?: string) => {
    try {
      const res = await api.get('/api/admin/companies/', { params: status ? { status } : {} });
      // Sync backend companies into store
      if (res.data?.length) {
        const store = useAppStore.getState();
        res.data.forEach((c: any) => {
          const exists = store.companies.find((sc) => sc.id === c.id);
          if (!exists) store.addCompany(c);
        });
      }
      return res;
    } catch {
      // Fallback: serve from Zustand store
      const companies = useAppStore.getState().companies;
      const filtered = status ? companies.filter((c) => c.status === status) : companies;
      return { data: filtered as any };
    }
  },

  createCompany: async (data: Record<string, any>) => {
    const newCompany = {
      ...data,
      id: Date.now(),
      status: 'pending',
      updated_at: new Date().toISOString(),
    } as any;
    useAppStore.getState().addCompany(newCompany);
    return { data: newCompany };
  },

  updateCompany: async (id: number, data: Record<string, any>) => {
    useAppStore.getState().updateCompany(id, data);
    return { data: { ...data, id } };
  },

  approveCompany: async (id: number) => {
    try {
      const res = await api.post(`/api/admin/companies/${id}/approve/`);
      useAppStore.getState().updateCompany(id, { status: 'approved' });
      return res;
    } catch {
      useAppStore.getState().updateCompany(id, { status: 'approved' });
      return { data: { id, status: 'approved' } };
    }
  },

  rejectCompany: async (id: number) => {
    try {
      const res = await api.post(`/api/admin/companies/${id}/reject/`);
      useAppStore.getState().updateCompany(id, { status: 'rejected' });
      return res;
    } catch {
      useAppStore.getState().updateCompany(id, { status: 'rejected' });
      return { data: { id, status: 'rejected' } };
    }
  },

  /** Delete a company — removes from backend and local store */
  deleteCompany: async (id: number) => {
    try {
      await api.delete(`/api/admin/companies/${id}/`);
    } catch { /* ignore if not on backend */ }
    useAppStore.getState().deleteCompany(id);
    return { data: { id } };
  },

  getDrafts: async () => ({
    data: useAppStore.getState().companies.filter((c) => c.status === 'draft') as any,
  }),

  getDraftResume: async (id: number) => ({
    data: useAppStore.getState().companies.find((c) => c.id === Number(id)) as any,
  }),

  saveDraft: async (data: Record<string, any>) => {
    if (data.id) {
      useAppStore.getState().updateCompany(data.id, data);
      return { data };
    }
    const newDraft = {
      ...data,
      id: Date.now(),
      status: 'draft',
      updated_at: new Date().toISOString(),
    } as any;
    useAppStore.getState().addCompany(newDraft);
    return { data: newDraft };
  },

  // ── Study Materials ─────────────────────────────────
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

  rejectMaterialWithReason: (id: number, reason: string) =>
    api.post(`/api/admin/study-materials/${id}/reject/`, { reason }),

  // ── Crew ────────────────────────────────────────────
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

  // ── News ─────────────────────────────────────────────
  getAdminNews: () => api.get('/api/admin/news/'),
  createNewsArticle: (data: Record<string, unknown>) => api.post('/api/admin/news/', data),
  updateNewsArticle: (id: number, data: Record<string, unknown>) =>
    api.put(`/api/admin/news/${id}/`, data),
  deleteNews: (id: number) => api.delete(`/api/admin/news/${id}/`),
  publishNews: (id: number) => api.post(`/api/admin/news/${id}/publish/`),

  // ── Resources ───────────────────────────────────────
  getAdminResources: () => api.get('/api/admin/resources/'),
  createResource: (data: Record<string, unknown>) => api.post('/api/admin/resources/', data),
  updateResource: (id: number, data: Record<string, unknown>) =>
    api.put(`/api/admin/resources/${id}/`, data),
  deleteResource: (id: number) => api.delete(`/api/admin/resources/${id}/`),
  activateResource: (id: number) => api.post(`/api/admin/resources/${id}/activate/`),

  // ── Contributions ────────────────────────────────────
  getContributions: async () => {
    const reqs = useAppStore.getState().contributions.filter((c) => c.status === 'pending');
    return {
      data: reqs.map((c) => ({
        id: c.id,
        company_name: c.companyName,
        contributor_name: c.submittedBy,
        contribution_type: c.type,
        content: c.content,
        status: c.status,
        created_at: c.timestamp,
      })) as any,
    };
  },

  approveContribution: async (id: number) => {
    useAppStore.getState().updateContributionStatus(id, 'approved');
    return { data: { id, status: 'approved' } as any };
  },

  rejectContribution: async (id: number) => {
    useAppStore.getState().updateContributionStatus(id, 'rejected');
    return { data: { id, status: 'rejected' } as any };
  },

  // ── Events ──────────────────────────────────────────
  /** Fetch events from REAL backend */
  getAdminEvents: () => api.get('/api/events/events/'),

  createEvent: (data: FormData | Record<string, any>) =>
    api.post('/api/events/events/', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  updateEvent: (id: number, data: FormData | Record<string, any>) =>
    api.patch(`/api/events/events/${id}/`, data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  deleteEvent: (id: number) => api.delete(`/api/events/events/${id}/`),

  /** Upload a single image for an event */
  addEventImage: (_eventId: number, formData: FormData) =>
    api.post(`/api/events/event-images/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteEventImage: (imageId: number) =>
    api.delete(`/api/events/event-images/${imageId}/`),
};
