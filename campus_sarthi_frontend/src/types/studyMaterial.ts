export interface StudyMaterial {
  id: number;
  title: string;
  description: string;
  category: 'Aptitude' | 'Technical' | 'HR Interview' | 'GD Preparation' | 'Resume' | 'Domain Specific';
  file: string;
  thumbnail: string | null;
  file_size: string;
  file_type: string;
  status: 'pending' | 'approved' | 'rejected';
  download_count: number;
  uploaded_by_name: string;
  created_at: string;
  rejection_reason?: string;
}
