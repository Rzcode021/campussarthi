import React from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

interface BookmarkButtonProps {
  type: 'company' | 'question';
  id: number;
}

export default function BookmarkButton({ type, id }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(type, id);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(type, id); }}
      className={`p-1.5 rounded-lg transition-colors ${bookmarked ? 'text-primary bg-primary-light' : 'text-muted hover:text-primary hover:bg-primary-light'}`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <Bookmark size={16} className={bookmarked ? 'fill-primary' : ''} />
    </button>
  );
}
