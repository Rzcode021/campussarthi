export interface Bookmark {
  id: number;
  user: number;
  bookmark_type: 'company' | 'question';
  object_id: number;
  created_at: string;
}
