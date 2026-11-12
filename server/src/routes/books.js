const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, optionalToken } = require('../middleware/auth');

// Get all books (with search & category filters)
router.get('/', optionalToken, (req, res) => {
  const { q = '', category = 'All' } = req.query;
  const books = db.getBooks(q, category);
  res.json({ books });
});

// Get single book details
router.get('/:id', optionalToken, (req, res) => {
  const book = db.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const chapters = db.getChaptersByBookId(book.id).map(ch => ({
    id: ch.id,
    chapterNumber: ch.chapterNumber,
    title: ch.title
  }));

  const reviews = db.getReviewsByBookId(book.id);

  // Check if current user has this in their library
  let inLibrary = false;
  let userProgress = 0;
  let lastChapterId = null;

  if (req.user) {
    const userLib = db.getUserLibrary(req.user.id).find(e => e.bookId === book.id);
    if (userLib) {
      inLibrary = true;
      userProgress = userLib.progressPercent;
      lastChapterId = userLib.lastChapterId;
    }
  }

  res.json({
    book: {
      ...book,
      chapters,
      reviews,
      inLibrary,
      userProgress,
      lastChapterId
    }
  });
});

// Read single chapter
router.get('/:id/chapters/:chapterId', (req, res) => {
  const chapter = db.getChapterById(req.params.id, req.params.chapterId);
  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  const allChapters = db.getChaptersByBookId(req.params.id);
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);

  res.json({
    chapter,
    totalChapters: allChapters.length,
    previousChapterId: currentIndex > 0 ? allChapters[currentIndex - 1].id : null,
    nextChapterId: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].id : null
  });
});

// Create Book (Author/Admin)
router.post('/', authenticateToken, (req, res) => {
  const { title, description, category, price, coverUrl, firstChapterTitle, firstChapterContent } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required' });
  }

  const newBook = db.createBook({
    title,
    author: req.user.name,
    authorId: req.user.id,
    category,
    price: Number(price) || 0,
    coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description,
    pages: Math.floor(Math.random() * 200) + 150,
    publishedYear: new Date().getFullYear(),
    featured: false
  });

  // Create default chapter 1 if provided
  if (firstChapterTitle && firstChapterContent) {
    db.createChapter({
      bookId: newBook.id,
      chapterNumber: 1,
      title: firstChapterTitle,
      content: firstChapterContent
    });
  }

  res.status(201).json({ book: newBook });
});

// Add Chapter to Book
router.post('/:id/chapters', authenticateToken, (req, res) => {
  const book = db.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Chapter title and content are required' });
  }

  const existingChapters = db.getChaptersByBookId(book.id);
  const chapterNumber = existingChapters.length + 1;

  const newChapter = db.createChapter({
    bookId: book.id,
    chapterNumber,
    title,
    content
  });

  res.status(201).json({ chapter: newChapter });
});

// Add Review to Book
router.post('/:id/reviews', authenticateToken, (req, res) => {
  const book = db.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  const review = db.createReview(req.user.id, req.user.name, book.id, rating, comment);
  res.status(201).json({ review });
});

module.exports = router;
