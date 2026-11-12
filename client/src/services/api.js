const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('lumina_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  },

  // Books
  async getBooks(query = '', category = 'All') {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    
    const res = await fetch(`${API_BASE}/books?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.books || [];
  },

  async getBookDetails(id) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Book not found');
    return data.book;
  },

  async getChapter(bookId, chapterId) {
    const res = await fetch(`${API_BASE}/books/${bookId}/chapters/${chapterId}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Chapter not found');
    return data;
  },

  async createBook(bookData) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create book');
    return data.book;
  },

  async addChapter(bookId, title, content) {
    const res = await fetch(`${API_BASE}/books/${bookId}/chapters`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add chapter');
    return data.chapter;
  },

  async addReview(bookId, rating, comment) {
    const res = await fetch(`${API_BASE}/books/${bookId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data.review;
  },

  // Library & Progress
  async getLibrary() {
    const res = await fetch(`${API_BASE}/library`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.library || [];
  },

  async addToLibrary(bookId) {
    const res = await fetch(`${API_BASE}/library/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add to library');
    return data.entry;
  },

  async updateProgress(bookId, chapterId, progressPercent) {
    const res = await fetch(`${API_BASE}/library/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId, chapterId, progressPercent })
    });
    const data = await res.json();
    return data.entry;
  },

  async toggleFavorite(bookId) {
    const res = await fetch(`${API_BASE}/library/toggle-favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId })
    });
    const data = await res.json();
    return data.entry;
  },

  // Bookmarks
  async getBookmarks(bookId) {
    const res = await fetch(`${API_BASE}/library/bookmarks/${bookId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.bookmarks || [];
  },

  async addBookmark(bookId, chapterId, chapterTitle, note, snippet) {
    const res = await fetch(`${API_BASE}/library/bookmarks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookId, chapterId, chapterTitle, note, snippet })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create bookmark');
    return data.bookmark;
  },

  async deleteBookmark(bookmarkId) {
    const res = await fetch(`${API_BASE}/library/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  }
};
