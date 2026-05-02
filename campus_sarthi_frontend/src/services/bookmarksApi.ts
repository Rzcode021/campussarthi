import api from './api';

export const bookmarksApi = {
  getAll: () => api.get('/api/bookmarks/'),
  toggle: (bookmark_type: string, object_id: number) =>
    api.post('/api/bookmarks/toggle/', { bookmark_type, object_id }),
};
