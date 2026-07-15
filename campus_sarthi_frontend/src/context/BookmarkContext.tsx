import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAppStore } from '../store/useAppStore';

interface BookmarkContextType {
  toggleBookmark: (type: 'company' | 'question' | 'resource', id: number) => Promise<void>;
  isBookmarked: (type: 'company' | 'question' | 'resource', id: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const storeBookmarks = useAppStore(state => state.bookmarks);
  const addBookmark = useAppStore(state => state.addBookmark);
  const removeBookmark = useAppStore(state => state.removeBookmark);

  const toggleBookmark = useCallback(async (type: 'company' | 'question' | 'resource', id: number) => {
    if (!isAuthenticated) return;
    const bookmarkId = `${type}-${id}`;
    const exists = useAppStore.getState().bookmarks.find(b => b.id === bookmarkId);
    
    if (exists) {
      removeBookmark(bookmarkId);
    } else {
      let title = `${type} ${id}`;
      let url = '/';
      
      if (type === 'company') {
        const c = useAppStore.getState().companies.find(c => c.id === id);
        if (c) { title = c.name; url = `/companies/${id}`; }
      } else if (type === 'resource') {
        url = '/resources';
        title = 'Saved Resource';
      } else if (type === 'question') {
        url = '/companies';
        title = `Question Q${id}`;
      }
      
      addBookmark({
        id: bookmarkId,
        type: type as any,
        title,
        url,
        addedAt: new Date().toISOString()
      });
    }
  }, [isAuthenticated, addBookmark, removeBookmark]);

  const isBookmarked = useCallback((type: 'company' | 'question' | 'resource', id: number) => {
    return storeBookmarks.some(b => b.id === `${type}-${id}`);
  }, [storeBookmarks]);

  return (
    <BookmarkContext.Provider value={{ toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
}
