import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Star, BookOpen, BookmarkCheck, Heart, MessageSquare, Send, Calendar, CheckCircle2 } from 'lucide-react';

export default function BookDetailModal({ bookId, onClose, onStartReading }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'chapters' | 'reviews'
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [savingLibrary, setSavingLibrary] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await api.getBookDetails(bookId);
        setBook(data);
        setInLibrary(data.inLibrary);
      } catch (err) {
        console.error('Failed to load book details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [bookId]);

  const handleAddToLibrary = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSavingLibrary(true);
    try {
      await api.addToLibrary(book.id);
      setInLibrary(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLibrary(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const newRev = await api.addReview(book.id, rating, comment);
      setBook(prev => ({
        ...prev,
        reviews: [newRev, ...(prev.reviews || [])],
        reviewsCount: (prev.reviewsCount || 0) + 1
      }));
      setComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-700">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow-md backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white border-b border-slate-100">
          
          {/* Cover Art */}
          <div className="w-36 md:w-48 h-52 md:h-64 rounded-2xl overflow-hidden shadow-xl shrink-0 mx-auto md:mx-0 border border-slate-200">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Core Info */}
          <div className="flex flex-col justify-between flex-grow text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {book.category}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  book.price === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-800'
                }`}>
                  {book.price === 0 ? 'FREE eBOOK' : `$${book.price.toFixed(2)}`}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
                {book.title}
              </h1>
              <p className="text-sm text-slate-600 font-medium mb-3">Written by <span className="text-slate-900 font-semibold">{book.author}</span></p>

              {/* Meta stats */}
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating}</span>
                  <span className="text-slate-400 font-normal">({book.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <span>{book.pages} pages</span>
                <span>•</span>
                <span>{book.publishedYear}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
              <button
                onClick={() => onStartReading(book.id, book.chapters?.[0]?.id)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {book.userProgress > 0 ? `Continue Reading (${book.userProgress}%)` : 'Start Reading'}
              </button>

              <button
                onClick={handleAddToLibrary}
                disabled={inLibrary || savingLibrary}
                className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                  inLibrary
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {inLibrary ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    On Your Shelf
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-slate-500" />
                    {savingLibrary ? 'Saving...' : 'Add to Bookshelf'}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Content Tabs */}
        <div className="border-b border-slate-200 px-6 md:px-8 flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-3.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chapters'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table of Contents
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded-full text-slate-600">
              {book.chapters?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reviews & Ratings
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded-full text-slate-600">
              {book.reviews?.length || 0}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8 max-h-[380px] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">About this book</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Length</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{book.pages} pages</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Publication</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{book.publishedYear}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Chapters</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{book.chapters?.length || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400">Access</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">Instant Web Reader</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chapters' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 mb-3">
                Click any chapter to jump straight into the immersive reading canvas.
              </p>
              {book.chapters?.map((ch, idx) => (
                <div
                  key={ch.id}
                  onClick={() => onStartReading(book.id, ch.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {ch.title}
                    </span>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read chapter <BookOpen className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Submit Review */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Leave your review</p>
                
                {/* Star Picker */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">{rating} of 5 Stars</span>
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={user ? "Write your honest thoughts about this book..." : "Please sign in to post a review."}
                    disabled={!user || submittingReview}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!user || !comment.trim() || submittingReview}
                    className="absolute right-2.5 bottom-3.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm disabled:opacity-40 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Submit
                  </button>
                </div>
              </form>

              {/* Reviews list */}
              <div className="space-y-3">
                {book.reviews && book.reviews.length > 0 ? (
                  book.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">No reviews yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
