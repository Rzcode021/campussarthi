export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'crew' | 'admin';
  is_active: boolean;
  is_staff: boolean;
  profile_photo: string | null;
  branch: string;
  year: number | null;
  phone: string;
  created_at: string;
}
