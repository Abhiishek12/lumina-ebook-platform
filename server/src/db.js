const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data', 'lumina.json');

// Initialize database with seed data if file doesn't exist
function initDb() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      if (data.users && data.books && data.chapters) {
        return data;
      }
    } catch (e) {
      console.warn('Existing db file corrupted, re-initializing...', e);
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const readerPassword = bcrypt.hashSync('reader123', salt);
  const authorPassword = bcrypt.hashSync('author123', salt);

  const initialData = {
    users: [
      {
        id: 'u-reader-1',
        name: 'Elena Rostova',
        email: 'reader@lumina.com',
        passwordHash: readerPassword,
        role: 'reader',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: 'u-author-1',
        name: 'Dr. Marcus Vance',
        email: 'author@lumina.com',
        passwordHash: authorPassword,
        role: 'author',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      }
    ],
    books: [
      {
        id: 'book-1',
        title: 'The AI Engineering Handbook',
        author: 'Dr. Marcus Vance',
        authorId: 'u-author-1',
        category: 'Technology',
        price: 0,
        featured: true,
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        description: 'A comprehensive, practitioner-focused deep dive into modern LLM system design, prompt architecture, autonomous agents, and vector databases in production environments.',
        rating: 4.9,
        reviewsCount: 128,
        pages: 340,
        publishedYear: 2026,
        createdAt: new Date().toISOString()
      },
      {
        id: 'book-2',
        title: 'Echoes of the Nebula: The Starlight Protocol',
        author: 'Lyra Thorne',
        authorId: 'u-author-1',
        category: 'Sci-Fi',
        price: 9.99,
        featured: true,
        coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
        description: 'When deep-space listening station Prometheus intercepts an encoded signal pulsing from the center of the Orion cloud, humanity is forced to decipher the first extraterrestrial coordinate.',
        rating: 4.8,
        reviewsCount: 94,
        pages: 412,
        publishedYear: 2025,
        createdAt: new Date().toISOString()
      },
      {
        id: 'book-3',
        title: 'Atomic Focus: The Deep Work Playbook',
        author: 'Julian Mercer',
        authorId: 'u-author-1',
        category: 'Productivity',
        price: 4.99,
        featured: false,
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        description: 'How elite thinkers, researchers, and creators eliminate micro-distractions, reconstruct cognitive momentum, and achieve effortless flow in an age of hyper-connectivity.',
        rating: 4.7,
        reviewsCount: 62,
        pages: 220,
        publishedYear: 2024,
        createdAt: new Date().toISOString()
      },
      {
        id: 'book-4',
        title: 'The Silicon Renaissance',
        author: 'Sophia Chen',
        authorId: 'u-author-1',
        category: 'Business',
        price: 14.99,
        featured: false,
        coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        description: 'An insider analysis of how solo-founder micro-multinationals and lean engineering teams are outcompeting legacy conglomerates with autonomous systems and agentic workflows.',
        rating: 4.9,
        reviewsCount: 81,
        pages: 295,
        publishedYear: 2026,
        createdAt: new Date().toISOString()
      },
      {
        id: 'book-5',
        title: 'Mysteries of the Cyber Citadel',
        author: 'Kaelen Rourke',
        authorId: 'u-author-1',
        category: 'Cyberpunk',
        price: 0,
        featured: false,
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        description: 'Beneath the neon grid of Neo-Kyoto lies the Citadel: an encrypted data sanctuary containing the memories of the world before the Great Protocol Freeze.',
        rating: 4.6,
        reviewsCount: 45,
        pages: 260,
        publishedYear: 2025,
        createdAt: new Date().toISOString()
      }
    ],
    chapters: [
      // Book 1 Chapters
      {
        id: 'ch-1-1',
        bookId: 'book-1',
        chapterNumber: 1,
        title: '1. The Foundations of Agentic AI Systems',
        content: `The paradigm of software engineering has fundamentally transformed. Where traditional deterministic systems relied strictly on procedural control flows and immutable rule matrices, modern intelligence architectures operate on semantic graphs and dynamic inference.\n\nIn this chapter, we establish the core primitives that govern resilient autonomous agents: contextual awareness, iterative reasoning loops, deterministic guardrails, and persistent memory interfaces.\n\n### The Anatomy of an Agent\nAn agent is more than an API wrapper around a generative model. It is an orchestration harness equipped with tools, perception filters, and memory caches. When an agent receives an objective, it decomposes that goal into atomic sub-tasks through recursive self-reflection.\n\n"The greatest strength of an agentic system is not its ability to guess the right answer on the first attempt; it is its systematic ability to critique, inspect, and self-correct when an intermediate assumption fails."\n\n### Memory Latency and Vector Indices\nContext windows, while expanding exponentially, introduce high quadratic computational costs. A production-grade system partitions memory into three tiers: immediate context (current turn tokens), episodic scratchpads (task history), and semantic long-term memory indexed via high-dimensional vector embeddings.\n\nBy leveraging localized cosine similarity and hybrid keyword-vector search, systems retrieve relevant domain context in sub-20 milliseconds, providing grounding without polluting prompt tokens.`
      },
      {
        id: 'ch-1-2',
        bookId: 'book-1',
        chapterNumber: 2,
        title: '2. High-Performance Retrieval & RAG Architecture',
        content: `Retrieval-Augmented Generation (RAG) is the bridge connecting static pretrained model weights to live, evolving organizational knowledge. However, naive chunk-and-embed approaches quickly deteriorate when faced with complex documents, nested tables, and ambiguous search intents.\n\n### Advanced Chunking Strategies\nStandard fixed-length 500-token chunking frequently fragments semantic thoughts across arbitrary paragraph boundaries. Instead, hierarchical chunking preserves document hierarchy—indexing both high-level section summaries and granular paragraphs linked by parent-child relational pointers.\n\nWhen a user queries the index, semantic routing first identifies the thematic cluster, retrieves parent nodes, and supplies contextual breadcrumbs to the language model.\n\n### Guardrails and Evaluation\nWithout continuous validation, hallucinations creep into production outputs. Robust architectures incorporate dual-pass verification: an evaluator model assesses retrieved evidence against generated citations before transmitting the stream to client interfaces.`
      },
      {
        id: 'ch-1-3',
        bookId: 'book-1',
        chapterNumber: 3,
        title: '3. Streaming Interfaces & Real-Time Orchestration',
        content: `Users demand immediacy. Waiting 12 seconds for an entire generative response to finalize in memory before rendering creates friction and perceived system sluggishness. The solution is end-to-end Server-Sent Events (SSE) and WebSocket duplex streaming.\n\n### Chunk Decoding and React State Reconciliation\nWhen consuming a token stream on the client side, updating high-level state on every single token arrival causes severe DOM repaint thrashing. Instead, modern frontends utilize animation frame scheduling (requestAnimationFrame) or decoupled virtualized buffers.\n\nThis ensures 60 FPS buttery-smooth typing animations regardless of the model throughput speed or token burst frequencies.`
      },

      // Book 2 Chapters
      {
        id: 'ch-2-1',
        bookId: 'book-2',
        chapterNumber: 1,
        title: '1. The Silent Station',
        content: `Deep in the solar void beyond Saturn's rings, Listening Station Prometheus spun slowly against the velvet backdrop of interstellar space. Its massive radio-dish array, suspended in zero gravity, had listened to cosmic radiation for seventy-two years without interruption.\n\nCommander Sarah Lin adjusted the optical spectrometer. Outside the observation deck, the rings of Saturn looked like razor-thin gold leaf slicing across the black abyss.\n\n"Sarah, you need to see this," murmured Dr. Jonas Krell, his hands trembling over the holographic console. "Signal band 1420 megahertz. Hydrogen line. But the modulation is artificial. It has mathematical symmetry."\n\nSarah stepped forward. The waveform on the glass screen was not random noise. It was a Fibonacci sequence interleaved with prime harmonic oscillations. And it was repeating every 42 seconds.`
      },
      {
        id: 'ch-2-2',
        bookId: 'book-2',
        chapterNumber: 2,
        title: '2. The Decryption Lattice',
        content: `The signal contained three layers of data. The outer envelope was binary geometry—a universal handshake. The middle layer was stellar cartography, mapping out pulsar coordinates from a perspective four thousand light-years away from Earth.\n\n"They aren't broadcasting to everyone," Sarah whispered, tracing the blue light trails across the room. "They designed the signal to focus directly along the solar ecliptic plane. It was targeted specifically at our sun."\n\nAs the cryptographic subsystem processed the third layer, the station's primary AI engaged emergency quarantine protocols. A single audio message decoded into acoustic pressure waves in the command bridge: a low, resonant chord followed by a voice speaking ancient Sumerian phonetic structures.`
      },
      {
        id: 'ch-2-3',
        bookId: 'book-2',
        chapterNumber: 3,
        title: '3. Departure Vector',
        content: `Orders from the United Earth Directorate arrived six hours later: classified Level Zero. The Prometheus was commanded to power down external transmitters and prepare for the arrival of the relativistic research vessel *Aethelgard*.\n\nSarah looked at Jonas. "If we surrender the data log to the Directorate, this discovery will be buried in military archives for decades."\n\n"What are you thinking, Commander?"\n\nSarah inserted the master cryptographic crystal into her personal wrist terminal. "I'm sending the coordinate packet to every open-source observatory on Earth and the Mars colonies. The stars belong to everyone."`
      },

      // Book 3 Chapters
      {
        id: 'ch-3-1',
        bookId: 'book-3',
        chapterNumber: 1,
        title: '1. The Architecture of Deep Attention',
        content: `We live in an attention economy meticulously engineered to fragment our cognitive focus. Every notification badge, algorithmic feed, and auto-playing video is designed to capture dopamine circuits that evolved for survival in sparse information environments.\n\nDeep work is not merely a habit; it is a competitive superpower. When you cultivate sustained, unbroken concentration for 90-minute blocks, your brain produces myelin insulation along neural pathways, accelerating skill acquisition by orders of magnitude.\n\n### The Three Pillars of Cognitive Preservation\n1. **Zero-Infiltration Sanctuaries:** Physical and digital boundaries where incoming communications cannot penetrate.\n2. **Monotasking Rituals:** Eliminating context switching—the hidden cost that degrades working memory capacity by up to 40%.\n3. **Active Recovery:** Rest that recharges executive function rather than numbing it with hyper-stimulating media.`
      },
      {
        id: 'ch-3-2',
        bookId: 'book-3',
        chapterNumber: 2,
        title: '2. The Friction Principle',
        content: `Willpower is a depletable biological resource. Relying on sheer determination to resist checking distracting websites or notifications is a failing strategy. Instead, world-class performers systematically manipulate friction.\n\nIf an action is constructive (writing code, studying, exercising), decrease the friction required to begin it to zero. Have your tools open, your environment ready, and your next step predetermined.\n\nIf an action is destructive (infinite scrolling, compulsive checking), introduce multiple layers of deliberate friction: log out of sessions, store devices in other rooms, or apply network-level blocks.\n\n"You do not rise to the level of your goals; you fall to the friction thresholds of your environment."`
      },
      {
        id: 'ch-3-3',
        bookId: 'book-3',
        chapterNumber: 3,
        title: '3. Designing the 90-Minute Focus Sprint',
        content: `Human ultradian rhythms naturally oscillate in approximately 90-to-120 minute cycles of high cerebral activation followed by troughs of mental fatigue. Aligning your most demanding analytical work with these biological pulses produces peak flow states.\n\nBefore initiating a sprint, write down the single verifiable milestone you will accomplish before the timer sounds. Close every extraneous browser tab. When the sprint concludes, step completely away from digital screens for 15 minutes to allow neural consolidation.`
      }
    ],
    userLibrary: [
      {
        id: 'lib-1',
        userId: 'u-reader-1',
        bookId: 'book-1',
        progressPercent: 65,
        lastChapterId: 'ch-1-2',
        isFavorite: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'lib-2',
        userId: 'u-reader-1',
        bookId: 'book-2',
        progressPercent: 33,
        lastChapterId: 'ch-2-1',
        isFavorite: false,
        updatedAt: new Date().toISOString()
      }
    ],
    bookmarks: [
      {
        id: 'bm-1',
        userId: 'u-reader-1',
        bookId: 'book-1',
        chapterId: 'ch-1-1',
        chapterTitle: '1. The Foundations of Agentic AI Systems',
        note: 'Key insight regarding iterative self-correction loops.',
        snippet: 'The greatest strength of an agentic system is not its ability to guess the right answer...',
        createdAt: new Date().toISOString()
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        bookId: 'book-1',
        userId: 'u-reader-1',
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Brilliant breakdown of agentic memory architectures and streaming protocols. Essential reading for every modern software engineer!',
        createdAt: new Date().toISOString()
      },
      {
        id: 'rev-2',
        bookId: 'book-2',
        userId: 'u-reader-1',
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Could not put this down. The sci-fi atmosphere and realistic astrophysics make the mystery so gripping.',
        createdAt: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

// In-memory cache + persistent disk synchronization
let cache = initDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

const db = {
  // Users
  getUsers: () => cache.users,
  findUserByEmail: (email) => cache.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  findUserById: (id) => cache.users.find(u => u.id === id),
  createUser: (userData) => {
    const newUser = {
      id: 'u-' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    cache.users.push(newUser);
    saveDb();
    return newUser;
  },

  // Books
  getBooks: (query = '', category = '') => {
    let result = cache.books;
    if (category && category !== 'All') {
      result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return result;
  },
  getBookById: (id) => cache.books.find(b => b.id === id),
  createBook: (bookData) => {
    const newBook = {
      id: 'book-' + Date.now(),
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      ...bookData
    };
    cache.books.unshift(newBook);
    saveDb();
    return newBook;
  },
  updateBook: (id, updates) => {
    const idx = cache.books.findIndex(b => b.id === id);
    if (idx === -1) return null;
    cache.books[idx] = { ...cache.books[idx], ...updates };
    saveDb();
    return cache.books[idx];
  },

  // Chapters
  getChaptersByBookId: (bookId) => {
    return cache.chapters
      .filter(c => c.bookId === bookId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  },
  getChapterById: (bookId, chapterId) => {
    return cache.chapters.find(c => c.bookId === bookId && c.id === chapterId);
  },
  createChapter: (chapterData) => {
    const newChapter = {
      id: 'ch-' + Date.now(),
      ...chapterData
    };
    cache.chapters.push(newChapter);
    saveDb();
    return newChapter;
  },

  // User Library
  getUserLibrary: (userId) => {
    const userEntries = cache.userLibrary.filter(item => item.userId === userId);
    return userEntries.map(entry => {
      const book = cache.books.find(b => b.id === entry.bookId);
      const lastChapter = cache.chapters.find(c => c.id === entry.lastChapterId);
      return {
        ...entry,
        book,
        lastChapterTitle: lastChapter ? lastChapter.title : 'Chapter 1'
      };
    }).filter(e => e.book != null);
  },
  addToLibrary: (userId, bookId) => {
    let entry = cache.userLibrary.find(e => e.userId === userId && e.bookId === bookId);
    if (!entry) {
      const firstChapter = cache.chapters.find(c => c.bookId === bookId);
      entry = {
        id: 'lib-' + Date.now(),
        userId,
        bookId,
        progressPercent: 0,
        lastChapterId: firstChapter ? firstChapter.id : null,
        isFavorite: false,
        updatedAt: new Date().toISOString()
      };
      cache.userLibrary.push(entry);
      saveDb();
    }
    return entry;
  },
  updateLibraryProgress: (userId, bookId, lastChapterId, progressPercent) => {
    let entry = cache.userLibrary.find(e => e.userId === userId && e.bookId === bookId);
    if (!entry) {
      entry = {
        id: 'lib-' + Date.now(),
        userId,
        bookId,
        progressPercent,
        lastChapterId,
        isFavorite: false,
        updatedAt: new Date().toISOString()
      };
      cache.userLibrary.push(entry);
    } else {
      entry.progressPercent = progressPercent;
      if (lastChapterId) entry.lastChapterId = lastChapterId;
      entry.updatedAt = new Date().toISOString();
    }
    saveDb();
    return entry;
  },
  toggleFavorite: (userId, bookId) => {
    let entry = cache.userLibrary.find(e => e.userId === userId && e.bookId === bookId);
    if (!entry) {
      entry = db.addToLibrary(userId, bookId);
    }
    entry.isFavorite = !entry.isFavorite;
    saveDb();
    return entry;
  },

  // Bookmarks
  getBookmarks: (userId, bookId) => {
    return cache.bookmarks.filter(b => b.userId === userId && b.bookId === bookId);
  },
  createBookmark: (bookmarkData) => {
    const newBm = {
      id: 'bm-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...bookmarkData
    };
    cache.bookmarks.push(newBm);
    saveDb();
    return newBm;
  },
  deleteBookmark: (id, userId) => {
    const idx = cache.bookmarks.findIndex(b => b.id === id && b.userId === userId);
    if (idx !== -1) {
      cache.bookmarks.splice(idx, 1);
      saveDb();
      return true;
    }
    return false;
  },

  // Reviews
  getReviewsByBookId: (bookId) => {
    return cache.reviews.filter(r => r.bookId === bookId);
  },
  createReview: (userId, userName, bookId, rating, comment) => {
    const newReview = {
      id: 'rev-' + Date.now(),
      bookId,
      userId,
      userName,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };
    cache.reviews.unshift(newReview);
    
    // Recalculate book average rating
    const bookReviews = cache.reviews.filter(r => r.bookId === bookId);
    const avg = bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length;
    const book = cache.books.find(b => b.id === bookId);
    if (book) {
      book.rating = Math.round(avg * 10) / 10;
      book.reviewsCount = bookReviews.length;
    }

    saveDb();
    return newReview;
  }
};

module.exports = db;
