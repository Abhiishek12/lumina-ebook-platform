const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// All library routes require authentication
router.use(authenticateToken);

// Get user library
router.get('/', (req, res) => {
  const library = db.getUserLibrary(req.user.id);
  res.json({ library });
});

// Add book to library
router.post('/add', (req, res) => {
  const { bookId } = req.body;
  if (!bookId) {
    return res.status(400).json({ error: 'bookId is required' });
  }

  const book = db.getBookById(bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const entry = db.addToLibrary(req.user.id, bookId);
  res.status(201).json({ entry });
});

// Update reading progress
router.post('/progress', (req, res) => {
  const { bookId, chapterId, progressPercent } = req.body;
  if (!bookId) {
    return res.status(400).json({ error: 'bookId is required' });
  }

  const entry = db.updateLibraryProgress(
    req.user.id,
    bookId,
    chapterId,
    Math.min(100, Math.max(0, Number(progressPercent) || 0))
  );

  res.json({ entry });
});

// Toggle Favorite
router.post('/toggle-favorite', (req, res) => {
  const { bookId } = req.body;
  if (!bookId) {
    return res.status(400).json({ error: 'bookId is required' });
  }

  const entry = db.toggleFavorite(req.user.id, bookId);
  res.json({ entry });
});

// Get Bookmarks for a book
router.get('/bookmarks/:bookId', (req, res) => {
  const bookmarks = db.getBookmarks(req.user.id, req.params.bookId);
  res.json({ bookmarks });
});

// Create Bookmark
router.post('/bookmarks', (req, res) => {
  const { bookId, chapterId, chapterTitle, note, snippet } = req.body;
  if (!bookId || !chapterId) {
    return res.status(400).json({ error: 'bookId and chapterId are required' });
  }

  const bookmark = db.createBookmark({
    userId: req.user.id,
    bookId,
    chapterId,
    chapterTitle: chapterTitle || 'Chapter',
    note: note || '',
    snippet: snippet || ''
  });

  res.status(201).json({ bookmark });
});

// Delete Bookmark
router.delete('/bookmarks/:id', (req, res) => {
  const success = db.deleteBookmark(req.params.id, req.user.id);
  if (!success) {
    return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
  }
  res.json({ success: true });
});

module.exports = router;
