import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Feather, Plus, BookOpen, Star, Users, DollarSign, 
  Sparkles, CheckCircle2, FileText, ArrowRight, X 
} from 'lucide-react';

const COVER_PRESETS = [
  { name: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cosmic Nebula', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80' },
  { name: 'Minimalist Desk', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Digital Grid', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' }
];

export default function AuthorStudioView({ onStartReading, onSelectBook }) {
  const { user, quickDemoLogin } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [selectedBookForChapter, setSelectedBookForChapter] = useState(null);

  // New Book form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [price, setPrice] = useState(0);
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [description, setDescription] = useState('');
  const [chapterTitle, setChapterTitle] = useState('1. Introduction & Overview');
  const [chapterContent, setChapterContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  // New Chapter form state
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);

  const fetchAuthorBooks = async () => {
    try {
      const allBooks = await api.getBooks();
      // Filter books authored by this user
      const authorBooks = allBooks.filter(b => b.authorId === user?.id || b.author === user?.name);
      setBooks(authorBooks.length > 0 ? authorBooks : allBooks.slice(0, 3));
    } catch (err) {
      console.error('Failed to load author books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorBooks();
  }, [user]);

  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!title || !description || !chapterContent) {
      alert('Please fill in title, description, and initial chapter content.');
      return;
    }

    setPublishing(true);
    try {
      await api.createBook({
        title,
        category,
        price: Number(price),
        coverUrl,
        description,
        firstChapterTitle: chapterTitle,
        firstChapterContent: chapterContent
      });
      setIsPublishModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setChapterContent('');
      await fetchAuthorBooks();
    } catch (err) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleAddChapterSubmit = async (e) => {
    e.preventDefault();
    if (!newChapterTitle || !newChapterContent || !selectedBookForChapter) return;

    setAddingChapter(true);
    try {
      await api.addChapter(selectedBookForChapter.id, newChapterTitle, newChapterContent);
      setIsAddChapterModalOpen(false);
      setNewChapterTitle('');
      setNewChapterContent('');
      setSelectedBookForChapter(null);
      alert('Chapter added successfully!');
      await fetchAuthorBooks();
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingChapter(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Feather className="w-3.5 h-3.5" />
            Author & Publisher Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Author Publishing Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Create, format, and publish multi-chapter eBooks directly to the LuminaBooks global catalog.
          </p>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Publish New eBook
        </button>
      </div>

      {/* Author Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500">Published Titles</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{books.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500">Active Readers</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">1,480</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-500">Average Rating</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">4.9 / 5.0</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-500">Store Royalty</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">85%</p>
        </div>
      </div>

      {/* Published Works */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Active Publications</h2>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 mb-4">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-xl shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-grow">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {book.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {book.price === 0 ? 'Free' : `$${book.price.toFixed(2)}`} • {book.rating || 5.0} ★
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {book.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedBookForChapter(book);
                      setIsAddChapterModalOpen(true);
                    }}
                    className="py-2 px-3 text-xs font-semibold rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Chapter
                  </button>

                  <button
                    onClick={() => onStartReading(book.id)}
                    className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish New Book Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Publish a New eBook</h3>
                  <p className="text-xs text-slate-500">Fill in details and write the opening chapter.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Architecting Distributed Intelligence"
                  className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Genre / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Business">Business</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0 for Free"
                    className="w-full p-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Preset Cover Art</label>
                <div className="grid grid-cols-5 gap-2">
                  {COVER_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCoverUrl(preset.url)}
                      className={`h-20 rounded-xl overflow-hidden border-2 transition-all relative ${
                        coverUrl === preset.url ? 'border-indigo-600 scale-102 ring-2 ring-indigo-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Synopsis / Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the core themes and takeaways of your book..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Chapter 1 (Initial Release)</h4>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Chapter Title</label>
                  <input
                    type="text"
                    required
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="e.g. 1. The Horizon Beckons"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Chapter Text / Content</label>
                  <textarea
                    rows={6}
                    required
                    value={chapterContent}
                    onChange={(e) => setChapterContent(e.target.value)}
                    placeholder="Write or paste your markdown chapter paragraphs here..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-6 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Publish to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {isAddChapterModalOpen && selectedBookForChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Chapter</h3>
                <p className="text-xs text-slate-500">{selectedBookForChapter.title}</p>
              </div>
              <button onClick={() => setIsAddChapterModalOpen(false)} className="opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChapterSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. 4. Scaling the Infrastructure"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Content</label>
                <textarea
                  rows={7}
                  required
                  value={newChapterContent}
                  onChange={(e) => setNewChapterContent(e.target.value)}
                  placeholder="Write or paste your markdown chapter content here..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddChapterModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingChapter}
                  className="px-5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {addingChapter ? 'Adding...' : 'Add Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
