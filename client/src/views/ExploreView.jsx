import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import BookCard from '../components/BookCard';
import { Search, Sparkles, TrendingUp, BookOpen, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Sci-Fi', 'Productivity', 'Business', 'Cyberpunk'];

export default function ExploreView({ onSelectBook, onStartReading }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const data = await api.getBooks(searchQuery, selectedCategory);
        setBooks(data);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search slightly
    const timer = setTimeout(() => {
      loadBooks();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const featuredBook = books.find(b => b.featured) || books[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Featured Banner */}
      {featuredBook && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl p-6 sm:p-10 border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-xl text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Book of the Month
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {featuredBook.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed">
                {featuredBook.description}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => onStartReading(featuredBook.id)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/40 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Sample Chapter
                </button>
                <button
                  onClick={() => onSelectBook(featuredBook)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md transition-all"
                >
                  View Details & Reviews
                </button>
              </div>
            </div>

            {/* Featured Book Cover with 3D drop shadow */}
            <div 
              onClick={() => onSelectBook(featuredBook)}
              className="w-44 sm:w-56 h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10 shrink-0 transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer"
            >
              <img
                src={featuredBook.coverUrl}
                alt={featuredBook.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      )}

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Explore the Library</h2>
            <p className="text-xs text-slate-500 mt-0.5">Instant in-browser access across all genres.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, topic..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Filtering catalog...</p>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelectBook={onSelectBook}
              onReadNow={(b) => onStartReading(b.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            We couldn't find any titles matching "{searchQuery}". Try searching for another topic or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
