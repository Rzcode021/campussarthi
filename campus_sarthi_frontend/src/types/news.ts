export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  tag: 'Tech' | 'Placements' | 'Industry' | 'Campus';
  source: string;
  url: string;
  is_published: boolean;
  published_at: string;
}
