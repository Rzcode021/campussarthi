import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { bookmarksApi } from '../services/bookmarksApi';
import { useAuth } from './AuthContext';

interface BookmarkContextType {
  bookmarks: Set<string>;
  toggleBookmark: (type: 'company' | 'question', id: number) => Promise<void>;
  isBookmarked: (type: 'company' | 'question', id: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) { setBookmarks(new Set()); return; }
    bookmarksApi.getAll().then((res) => {
      const keys = res.data.map((b: { bookmark_type: string; object_id: number }) =>
        `${b.bookmark_type}-${b.object_id}`
      );
      setBookmarks(new Set(keys));
    }).catch(() => {});
  }, [isAuthenticated]);

  const toggleBookmark = useCallback(async (type: 'company' | 'question', id: number) => {
    const key = `${type}-${id}`;
    await bookmarksApi.toggle(type, id);
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((type: 'company' | 'question', id: number) =>
    bookmarks.has(`${type}-${id}`), [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
}
