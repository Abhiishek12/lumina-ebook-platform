# 📖 LuminaBooks - Full-Stack eBook Platform & In-Browser eReader

A complete, production-grade digital bookstore, personal library, author publisher studio, and customizable in-browser eReader built with **React 18**, **Tailwind CSS**, **Node.js (Express)**, and **JWT Authentication**.

---

## ✨ Key Features

### 1. 📖 Interactive In-Browser eReader (Core Feature)
* **Distraction-Free Reading Canvas:** Pure typographic focus designed for long reading sessions.
* **Themes:**
  * **Light:** Crisp, clean paper appearance (`#ffffff`).
  * **Sepia:** Warm, soft e-ink eye comfort mode (`#f8f1e3`).
  * **Night:** Slate dark blue theme for low-light environments (`#181926`).
  * **OLED Midnight:** Deep pitch-black theme with high-contrast text (`#000000`).
* **Typography Controls:**
  * Font Family: **Serif** (Editorial/Merriweather), **Sans** (Inter), **Mono** (Code/Technical).
  * Font Size Stepper (14px to 26px with A- / A+ buttons and instant reset).
  * Reading Width Toggle: Narrow, Normal, or Wide margins.
* **Navigation & Drawer:**
  * Left slide-out drawer with **Table of Contents** and **Personal Notes & Bookmarks**.
  * Previous Chapter & Next Chapter navigation with keyboard shortcuts (`←` / `→`).
* **Persistent Progress Tracking:**
  * Live percentage progress bar calculation.
  * Autosaves the reader's current chapter and percentage to their online bookshelf.

---

### 2. 🏪 Storefront & Discovery
* **Curated Catalog:** Preloaded with 5 books across Technology, Sci-Fi, Productivity, Business, and Cyberpunk.
* **Instant Search & Genre Filtering:** Search books by title, author, or keywords.
* **Book Details Modal:** Synopsis, page count, publication year, chapter list, and reviews.
* **Ratings & Reviews:** Submit star ratings (1–5) and community reviews.

---

### 3. 📚 Personal Bookshelf ("My Library")
* **Currently Reading:** Live progress bars with a one-click **"Resume Reading"** button that reopens the exact last-read chapter.
* **Favorites Shelf:** Toggle books to your favorites list with one click.
* **Reader Stats:** Books in library, active reads, completed books, and reading streak counter.

---

### 4. ✍️ Author & Publisher Studio
* **Creator Dashboard:** Overview of published titles, active readers, and royalty metrics.
* **Book Publisher Modal:** Upload new eBooks with custom or preset cover art, pricing ($0 for free), genre, synopsis, and initial chapter content.
* **Chapter Manager:** Add subsequent chapters to existing books at any time.

---

### 5. 🔐 Authentication & Demo Accounts
* Pre-configured JWT authentication with instant 1-click demo logins:
  * **Reader Account:** `reader@lumina.com` / `reader123` (Name: Elena Rostova)
  * **Author Account:** `author@lumina.com` / `author123` (Name: Dr. Marcus Vance)

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 4, CORS, dotenv |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |
| **Database** | Persistent JSON store with relational schema & atomic disk sync (`server/data/lumina.json`) |

---

## 🚀 Getting Started

### 1. Start the Backend API Server
Open a terminal in the project root:
```bash
cd server
npm start
```
*API will run at:* `http://localhost:5000`

### 2. Start the Frontend Client
In a second terminal:
```bash
cd client
npm run dev
```
*Web app will run at:* `http://localhost:5173`

---

## 📁 Project Structure

```text
lumina-ebook-platform/
├── server/
│   ├── data/
│   │   └── lumina.json          # Persistent database (users, books, chapters, bookmarks, reviews)
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Register, Login, Me endpoints
│   │   │   ├── books.js         # Catalog, single book, chapter reader, reviews
│   │   │   └── library.js       # Bookshelf, reading progress, bookmarks
│   │   ├── db.js                # Database queries and preloaded seed data
│   │   └── index.js             # Express application setup
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with demo switcher & profile
│   │   │   ├── AuthModal.jsx    # Sign in / Sign up with 1-click demo buttons
│   │   │   ├── BookCard.jsx     # Responsive catalog card
│   │   │   ├── BookDetailModal.jsx # Synopsis, chapters preview, reviews
│   │   │   └── ReaderView.jsx   # In-browser eReader with 4 themes & font controls
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User session & demo switching
│   │   ├── services/
│   │   │   └── api.js           # API client for backend communication
│   │   ├── views/
│   │   │   ├── ExploreView.jsx  # Storefront & featured book banner
│   │   │   ├── LibraryView.jsx  # Personal bookshelf & stats
│   │   │   └── AuthorStudioView.jsx # Publishing studio & chapter editor
│   │   ├── App.jsx              # Application router & modal manager
│   │   ├── main.jsx             # React entrypoint
│   │   └── index.css            # Tailwind & typography directives
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```
