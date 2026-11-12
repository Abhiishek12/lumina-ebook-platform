import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Heart, CheckCircle2, Flame, Award, BookMarked, 
  ArrowRight, Compass, Sparkles, Clock 
} from 'lucide-react';

export default function LibraryView({ onStartReading, onSelectBook, onExploreClick }) {
  const { user } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'in_progress' | 'favorites' | 'completed'

  const fetchLibrary = async () => {
    try {
      const data = await api.getLibrary();
      setLibrary(data);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleToggleFavorite = async (e, bookId) => {
    e.stopPropagation();
    try {
      await api.toggleFavorite(bookId);
      await fetchLibrary();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = library.filter(item => {
    if (filter === 'in_progress') return item.progressPercent > 0 && item.progressPercent < 100;
    if (filter === 'completed') return item.progressPercent >= 100;
    if (filter === 'favorites') return item.isFavorite;
    return true;
  });

  const booksCount = library.length;
  const completedCount = library.filter(i => i.progressPercent >= 100).length;
  const inProgressCount = library.filter(i => i.progressPercent > 0 && i.progressPercent < 100).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Bookshelf
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your personal library, saved bookmarks, and live reading progress.
            </p>
          </div>

          <button
            onClick={onExploreClick}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-indigo-100"
          >
            <Compass className="w-4 h-4" />
            Discover More Books
          </button>
        </div>

        {/* Reader Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <BookMarked className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-500">Books on Shelf</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{booksCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-500">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{inProgressCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-emerald-500 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-500">Finished</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-rose-500 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium text-slate-500">Day Streak</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">4 Days 🔥</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Titles ({library.length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'in_progress'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Reading Now ({inProgressCount})
        </button>
        <button
          onClick={() => setFilter('favorites')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filter === 'favorites'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          Favorites
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Library Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Opening bookshelf...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all flex gap-4"
            >
              {/* Cover */}
              <div 
                onClick={() => onSelectBook(item.book)}
                className="w-24 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer shadow-sm group-hover:scale-102 transition-transform"
              >
                <img
                  src={item.book.coverUrl}
                  alt={item.book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info & Progress */}
              <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.book.category}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, item.bookId)}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                      title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <h3 
                    onClick={() => onSelectBook(item.book)}
                    className="font-bold text-slate-900 text-sm leading-snug truncate hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {item.book.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">by {item.book.author}</p>
                </div>

                {/* Progress bar */}
                <div className="my-2">
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-500 font-medium truncate max-w-[120px]">
                      {item.lastChapterTitle}
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                      {item.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Continue Reading Button */}
                <button
                  onClick={() => onStartReading(item.bookId, item.lastChapterId)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {item.progressPercent > 0 ? 'Resume Reading' : 'Start Reading'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Your Bookshelf is empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse our curated catalog to add eBooks to your personal shelf and track your reading journey.
          </p>
          <button
            onClick={onExploreClick}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 inline-flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            Explore Store Catalog
          </button>
        </div>
      )}

    </div>
  );
}
