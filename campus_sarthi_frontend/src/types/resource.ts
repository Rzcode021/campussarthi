export interface Resource {
  id: number;
  title: string;
  description: string;
  category: 'DSA' | 'Python' | 'Interview Prep' | 'Aptitude';
  url: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_active: boolean;
}
