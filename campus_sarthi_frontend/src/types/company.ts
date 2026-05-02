export interface Company {
  id: number;
  name: string;
  logo: string | null;
  domain: 'CS' | 'Cyber' | 'Product' | 'Sales';
  about: string;
  job_role: string;
  salary_lpa: number;
  tech_requirements: string[];
  gd_questions: string[];
  interview_questions: string[];
  eligibility_criteria: string;
  bond_details: string;
  package_details?: string;
  selection_rounds?: string[];
  joining_location?: string;
  tentative_date?: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  uploaded_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyDocument {
  id: number;
  company: number;
  section: string;
  title: string;
  description: string;
  file_type: string;
  file_size: string;
  download_count: number;
  created_at: string;
  file: string;
}

export interface AdminCompanyDocument extends CompanyDocument {
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  uploaded_by_name: string;
  company_name: string;
}

export type GroupedDocuments = Record<string, CompanyDocument[]>;
