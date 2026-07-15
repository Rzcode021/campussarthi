import api from './api';
import { useAppStore } from '../store/useAppStore';

/**
 * Companies API — hits Django backend first, falls back to Zustand store when offline.
 */
export const companiesApi = {
  /** List approved companies. Falls back to Zustand store if API unavailable. */
  getAll: async (domain?: string, search?: string) => {
    try {
      const params: Record<string, string> = {};
      if (domain && domain !== 'All') params.domain = domain;
      if (search) params.search = search;
      const res = await api.get('/api/companies/', { params });
      // Sync approved companies into the store so the rest of the app stays consistent
      if (res.data?.length) {
        useAppStore.getState().setCompanies(
          res.data.map((c: any) => ({ ...c, status: 'approved' }))
        );
      }
      return res;
    } catch {
      // Offline fallback — return store data
      const companies = useAppStore.getState().companies.filter(c => c.status === 'approved');
      let filtered = companies;
      if (domain && domain !== 'All') filtered = filtered.filter(c => c.domain === domain);
      if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
      return { data: filtered };
    }
  },

  /** Get a single company by ID. Falls back to Zustand store if API unavailable. */
  getById: async (id: number) => {
    try {
      const res = await api.get(`/api/companies/${id}/`);
      return res;
    } catch {
      // Offline fallback
      const company = useAppStore.getState().companies.find(c => c.id === Number(id));
      return { data: company };
    }
  },

  /** Submit a user contribution for a company. Saves to store for instant admin preview. */
  submitContribution: async (data: {
    company: number;
    company_name?: string;
    contribution_type: string;
    content: string;
    submitted_by?: string;
  }) => {
    // Always save to store for realtime admin panel visibility
    const contribution = {
      id: Date.now(),
      companyId: data.company,
      companyName: data.company_name || 'Unknown',
      type: data.contribution_type,
      content: data.content || '',
      status: 'pending' as const,
      submittedBy: data.submitted_by || 'User',
      timestamp: new Date().toISOString(),
    };
    useAppStore.getState().addContribution(contribution);

    // Also try to persist on backend
    try {
      const res = await api.post(`/api/companies/${data.company}/contribute/`, {
        contribution_type: data.contribution_type,
        content: data.content,
      });
      return res;
    } catch {
      // Return the local contribution as fallback
      return { data: contribution };
    }
  },
};
