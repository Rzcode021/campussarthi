import type { User } from './user';

export interface CrewMember {
  id: number;
  user: User;
  title: string;
  department: string;
  bio: string;
  is_active: boolean;
  avg_rating: number;
  total_ratings: number;
}

export interface CrewRating {
  stars: number;
  comment: string;
  updated_at: string;
}
