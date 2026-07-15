import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Company {
  id: number;
  name: string;
  domain: string;
  job_role: string;
  salary_lpa: string;
  tech_requirements: string[];
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  joining_location: string;
  tentative_date: string;
  logo?: string;
  about?: string;
  eligibility_criteria?: string;
  bond_details?: string;
  selection_rounds?: string[];
  package_details?: string;
  gd_questions?: string[];
  interview_questions?: string[];
  updated_at: string;
}

export interface Bookmark {
  id: string;
  type: 'company' | 'resource' | 'material' | 'event';
  title: string;
  url: string;
  addedAt: string;
}

export interface Contribution {
  id: number;
  companyId: number;
  companyName: string;
  type: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  timestamp: string;
}

export interface CrewRating {
  id: string;
  crewMemberId: number;
  crewMemberName: string;
  rating: number;
  feedback: string;
  submittedBy: string;
  timestamp: string;
}

export interface AccessRequest {
  id: number;
  userId: number;
  userName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  type?: string;
  status?: 'upcoming' | 'past';
  images: { id: number; image: string }[];
}

interface AppState {
  companies: Company[];
  bookmarks: Bookmark[];
  contributions: Contribution[];
  crewRatings: CrewRating[];
  accessRequests: AccessRequest[];
  events: Event[];

  // Companies
  addCompany: (company: Company) => void;
  updateCompany: (id: number, company: Partial<Company>) => void;
  deleteCompany: (id: number) => void;
  setCompanies: (companies: Company[]) => void;

  // Bookmarks
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;

  // Contributions
  addContribution: (contribution: Contribution) => void;
  updateContributionStatus: (id: number, status: Contribution['status']) => void;

  // Crew Ratings
  addCrewRating: (rating: CrewRating) => void;

  // Access Requests
  addAccessRequest: (request: AccessRequest) => void;
  updateAccessRequestStatus: (id: number, status: AccessRequest['status']) => void;

  // Events
  addEvent: (event: Event) => void;
  updateEvent: (id: number, event: Partial<Event>) => void;
  deleteEvent: (id: number) => void;
}

// Initial mock data to ensure something shows up if it's empty initially
const INITIAL_COMPANIES: Company[] = [
  { id: 1, name: 'Google', domain: 'CS', job_role: 'Software Engineer', salary_lpa: '30+', tech_requirements: ['C++', 'Java'], status: 'approved', joining_location: 'Bangalore', tentative_date: 'August 2026', updated_at: new Date().toISOString() },
  { id: 2, name: 'Microsoft', domain: 'CS', job_role: 'SDE', salary_lpa: '25+', tech_requirements: ['C#', 'C++'], status: 'approved', joining_location: 'Hyderabad', tentative_date: 'July 2026', updated_at: new Date().toISOString() }
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      companies: INITIAL_COMPANIES,
      bookmarks: [],
      contributions: [],
      crewRatings: [],
      accessRequests: [], // Populated from real backend registrations only
      events: [],

      addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
      updateCompany: (id, data) => set((state) => ({
        companies: state.companies.map((c) => c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c)
      })),
      deleteCompany: (id) => set((state) => ({ companies: state.companies.filter((c) => c.id !== id) })),
      setCompanies: (companies) => set({ companies }),

      addBookmark: (bookmark) => set((state) => {
        if (state.bookmarks.some((b) => b.url === bookmark.url)) return state;
        return { bookmarks: [...state.bookmarks, bookmark] };
      }),
      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.id !== id) })),

      addContribution: (contribution) => set((state) => ({ contributions: [...state.contributions, contribution] })),
      updateContributionStatus: (id, status) => set((state) => ({
        contributions: state.contributions.map((c) => c.id === id ? { ...c, status } : c)
      })),

      addCrewRating: (rating) => set((state) => ({ crewRatings: [...state.crewRatings, rating] })),

      addAccessRequest: (request) => set((state) => ({ accessRequests: [...state.accessRequests, request] })),
      updateAccessRequestStatus: (id, status) => set((state) => ({
        accessRequests: state.accessRequests.map((r) => r.id === id ? { ...r, status } : r)
      })),

      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, data) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...data } : e)
      })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
    }),
    {
      name: 'campus-sarthi-store',
    }
  )
);
