import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, ArrowRight, Settings, List, Bookmark, BookmarkPlus, 
  Sun, Moon, Coffee, Maximize2, Minimize2, Type, Check, Trash2, X, Sparkles
} from 'lucide-react';

export default function ReaderView({ bookId, initialChapterId, onBackToLibrary }) {
  const { user } = useAuth();
  
  // Data state
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [currentChapterId, setCurrentChapterId] = useState(initialChapterId);
  const [totalChapters, setTotalChapters] = useState(1);
  const [prevChapterId, setPrevChapterId] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reader Customization State
  const [theme, setTheme] = useState('sepia'); // 'light' | 'sepia' | 'night' | 'oled'
  const [fontFamily, setFontFamily] = useState('serif'); // 'serif' | 'sans' | 'mono'
  const [fontSize, setFontSize] = useState(18); // 14 to 26
  const [lineHeight, setLineHeight] = useState('relaxed'); // 'normal' | 'relaxed' | 'loose'
  const [contentWidth, setContentWidth] = useState('max-w-2xl'); // 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl'

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('toc'); // 'toc' | 'bookmarks'
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const contentRef = useRef(null);

  // Fetch Book & Chapters
  useEffect(() => {
    async function initReader() {
      try {
        const bookData = await api.getBookDetails(bookId);
        setBook(bookData);
        
        const targetChapterId = currentChapterId || bookData.chapters?.[0]?.id;
        if (targetChapterId) {
          await loadChapter(targetChapterId);
        }

        // Fetch Bookmarks
        if (user) {
          const bms = await api.getBookmarks(bookId);
          setBookmarks(bms);
        }
      } catch (err) {
        console.error('Failed to load reader:', err);
      } finally {
        setLoading(false);
      }
    }
    initReader();
  }, [bookId]);

  // Load specific chapter
  const loadChapter = async (chapId) => {
    setLoading(true);
    try {
      const data = await api.getChapter(bookId, chapId);
      setChapter(data.chapter);
      setCurrentChapterId(chapId);
      setTotalChapters(data.totalChapters);
      setPrevChapterId(data.previousChapterId);
      setNextChapterId(data.nextChapterId);

      // Scroll to top of reading canvas
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Sync progress to backend
      if (user && book) {
        const currentIdx = book.chapters?.findIndex(c => c.id === chapId) ?? 0;
        const progress = Math.round(((currentIdx + 1) / (book.chapters?.length || 1)) * 100);
        api.updateProgress(bookId, chapId, progress);
      }
    } catch (err) {
      console.error('Failed to load chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && nextChapterId) {
        loadChapter(nextChapterId);
      } else if (e.key === 'ArrowLeft' && prevChapterId) {
        loadChapter(prevChapterId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextChapterId, prevChapterId]);

  // Add bookmark
  const handleSaveBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Sign in to save bookmarks');
      return;
    }
    try {
      const snippet = chapter?.content?.slice(0, 100) + '...';
      const newBm = await api.addBookmark(bookId, currentChapterId, chapter?.title, bookmarkNote, snippet);
      setBookmarks(prev => [newBm, ...prev]);
      setBookmarkNote('');
      setBookmarkModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete bookmark
  const handleDeleteBookmark = async (id) => {
    try {
      await api.deleteBookmark(id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Theme style mapping
  const themeStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-slate-800',
      headerBg: 'bg-white/90 border-slate-200',
      drawerBg: 'bg-white border-slate-200',
      cardBg: 'bg-slate-50 border-slate-200 text-slate-800',
      accent: 'text-indigo-600',
      progressTrack: 'bg-slate-200',
      progressBar: 'bg-indigo-600'
    },
    sepia: {
      bg: 'bg-[#f8f1e3]',
      text: 'text-[#4a3928]',
      headerBg: 'bg-[#f4ebd6]/90 border-[#e5d8be]',
      drawerBg: 'bg-[#f4ebd6] border-[#e5d8be]',
      cardBg: 'bg-[#ede1c7] border-[#dfcfb0] text-[#4a3928]',
      accent: 'text-[#8c5e2d]',
      progressTrack: 'bg-[#ded0b6]',
      progressBar: 'bg-[#8c5e2d]'
    },
    night: {
      bg: 'bg-[#181926]',
      text: 'text-[#cad3f5]',
      headerBg: 'bg-[#1e2030]/90 border-[#363a4f]',
      drawerBg: 'bg-[#1e2030] border-[#363a4f]',
      cardBg: 'bg-[#24273a] border-[#363a4f] text-[#cad3f5]',
      accent: 'text-[#8aadf4]',
      progressTrack: 'bg-[#363a4f]',
      progressBar: 'bg-[#8aadf4]'
    },
    oled: {
      bg: 'bg-black',
      text: 'text-zinc-300',
      headerBg: 'bg-zinc-950/90 border-zinc-900',
      drawerBg: 'bg-zinc-950 border-zinc-900',
      cardBg: 'bg-zinc-900 border-zinc-800 text-zinc-300',
      accent: 'text-zinc-100',
      progressTrack: 'bg-zinc-900',
      progressBar: 'bg-zinc-300'
    }
  };

  const currentTheme = themeStyles[theme];

  const fontClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };

  const lineHeightClasses = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  const currentIdx = book?.chapters?.findIndex(c => c.id === currentChapterId) ?? 0;
  const progressPercent = Math.round(((currentIdx + 1) / (book?.chapters?.length || 1)) * 100);

  if (loading && !chapter) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${currentTheme.bg}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-sm ${currentTheme.text}`}>Opening reading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${currentTheme.bg} ${currentTheme.text} transition-colors duration-200 select-text`}>
      
      {/* Top Header Bar */}
      <header className={`h-14 px-4 border-b backdrop-blur-md flex items-center justify-between shrink-0 ${currentTheme.headerBg} transition-colors duration-200`}>
        
        {/* Left: Back & Table of contents */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Reader</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Contents & Notes</span>
          </button>
        </div>

        {/* Center: Book & Chapter Title */}
        <div className="text-center truncate px-4 max-w-xs sm:max-w-md">
          <p className="text-xs font-bold truncate opacity-90">{book?.title}</p>
          <p className="text-[11px] truncate opacity-60 font-medium">{chapter?.title}</p>
        </div>

        {/* Right: Controls & Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setBookmarkModalOpen(true)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Bookmark this chapter"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-lg transition-colors ${
              settingsOpen ? 'bg-indigo-600 text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Reading Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </header>

      {/* Floating Settings Dropdown */}
      {settingsOpen && (
        <div className={`absolute top-16 right-4 z-40 w-72 p-4 rounded-2xl shadow-2xl border ${currentTheme.cardBg} animate-in fade-in slide-in-from-top-2`}>
          <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider">Reading Preferences</h4>
            <button onClick={() => setSettingsOpen(false)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold opacity-70 block mb-2">Theme</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => setTheme('light')}
                className={`py-2 px-1 text-xs font-medium rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  theme === 'light' ? 'border-indigo-600 bg-white text-slate-900 shadow-sm' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`py-2 px-1 text-xs font-medium rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  theme === 'sepia' ? 'border-amber-700 bg-[#f8f1e3] text-[#4a3928] shadow-sm' : 'border-[#e0d2b7] bg-[#f4ebd6] text-[#4a3928]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>Sepia</span>
              </button>

              <button
                onClick={() => setTheme('night')}
                className={`py-2 px-1 text-xs font-medium rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  theme === 'night' ? 'border-indigo-400 bg-[#181926] text-white shadow-sm' : 'border-slate-700 bg-[#1e2030] text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Night</span>
              </button>

              <button
                onClick={() => setTheme('oled')}
                className={`py-2 px-1 text-xs font-medium rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  theme === 'oled' ? 'border-zinc-400 bg-black text-white shadow-sm' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-700"></span>
                <span>OLED</span>
              </button>
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold opacity-70 block mb-2">Typeface</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setFontFamily('serif')}
                className={`py-1.5 text-xs font-serif rounded-lg border text-center ${
                  fontFamily === 'serif' ? 'border-indigo-600 font-bold bg-indigo-50/20' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`py-1.5 text-xs font-sans rounded-lg border text-center ${
                  fontFamily === 'sans' ? 'border-indigo-600 font-bold bg-indigo-50/20' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`py-1.5 text-xs font-mono rounded-lg border text-center ${
                  fontFamily === 'mono' ? 'border-indigo-600 font-bold bg-indigo-50/20' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Mono
              </button>
            </div>
          </div>

          {/* Font Size Stepper */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold opacity-70">Font Size</label>
              <span className="text-xs font-mono">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                className="flex-1 py-1 px-3 text-xs font-bold rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
              >
                A -
              </button>
              <button
                onClick={() => setFontSize(18)}
                className="py-1 px-3 text-[11px] rounded-lg border border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
              >
                Reset
              </button>
              <button
                onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                className="flex-1 py-1 px-3 text-sm font-bold rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
              >
                A +
              </button>
            </div>
          </div>

          {/* Width Selector */}
          <div>
            <label className="text-[11px] font-semibold opacity-70 block mb-1.5">Reading Width</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setContentWidth('max-w-xl')}
                className={`py-1 text-xs rounded border ${
                  contentWidth === 'max-w-xl' ? 'border-indigo-600 font-bold' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Narrow
              </button>
              <button
                onClick={() => setContentWidth('max-w-2xl')}
                className={`py-1 text-xs rounded border ${
                  contentWidth === 'max-w-2xl' ? 'border-indigo-600 font-bold' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setContentWidth('max-w-3xl')}
                className={`py-1 text-xs rounded border ${
                  contentWidth === 'max-w-3xl' ? 'border-indigo-600 font-bold' : 'border-black/10 dark:border-white/10'
                }`}
              >
                Wide
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Main Reading Canvas */}
      <main 
        ref={contentRef}
        className="flex-grow overflow-y-auto px-6 py-12 flex justify-center scroll-smooth"
      >
        <article className={`w-full ${contentWidth} ${fontClasses[fontFamily]} ${lineHeightClasses[lineHeight]} transition-all duration-200`}>
          
          {/* Chapter Header */}
          <div className="mb-10 text-center border-b border-black/10 dark:border-white/10 pb-8">
            <p className="text-xs uppercase font-bold tracking-widest opacity-60 mb-2">
              Chapter {chapter?.chapterNumber} of {totalChapters}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              {chapter?.title}
            </h1>
            <div className="w-12 h-0.5 mx-auto opacity-30 bg-current rounded-full"></div>
          </div>

          {/* Chapter Body Content */}
          <div 
            style={{ fontSize: `${fontSize}px` }}
            className="space-y-6 leading-relaxed"
          >
            {chapter?.content?.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold tracking-tight pt-4 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                return (
                  <blockquote key={index} className="pl-4 py-1 border-l-2 border-indigo-500/60 italic opacity-90 my-4 text-base">
                    {paragraph}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-justify indent-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Chapter End Navigation */}
          <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            {prevChapterId ? (
              <button
                onClick={() => loadChapter(prevChapterId)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Chapter
              </button>
            ) : <div />}

            {nextChapterId ? (
              <button
                onClick={() => loadChapter(nextChapterId)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all ml-auto"
              >
                Next Chapter
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-right ml-auto">
                <span className="text-xs font-bold opacity-70">🎉 Book Complete!</span>
              </div>
            )}
          </div>

        </article>
      </main>

      {/* Bottom Sticky Progress Bar */}
      <footer className={`h-11 px-4 border-t flex items-center justify-between text-xs shrink-0 ${currentTheme.headerBg}`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold opacity-70">Progress:</span>
          <span className="font-mono font-bold">{progressPercent}%</span>
        </div>

        {/* Visual Progress Bar */}
        <div className={`hidden sm:block flex-grow mx-6 h-1.5 rounded-full overflow-hidden ${currentTheme.progressTrack}`}>
          <div 
            className={`h-full ${currentTheme.progressBar} transition-all duration-300`} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="opacity-60 text-[11px]">
            Chapter {chapter?.chapterNumber} of {totalChapters}
          </span>
          <span className="opacity-40 hidden sm:inline">|</span>
          <span className="opacity-40 hidden sm:inline text-[11px]">Use ← → keys to flip chapters</span>
        </div>
      </footer>

      {/* Left Drawer: Table of Contents & Bookmarks */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setDrawerOpen(false)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className={`relative w-80 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 border-r ${currentTheme.drawerBg}`}>
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawerTab('toc')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    drawerTab === 'toc' ? 'bg-indigo-600 text-white' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Chapters ({book?.chapters?.length || 0})
                </button>
                <button
                  onClick={() => setDrawerTab('bookmarks')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    drawerTab === 'bookmarks' ? 'bg-indigo-600 text-white' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  Notes ({bookmarks.length})
                </button>
              </div>

              <button onClick={() => setDrawerOpen(false)} className="opacity-60 hover:opacity-100 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto p-3 space-y-1.5">
              {drawerTab === 'toc' && (
                book?.chapters?.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      loadChapter(ch.id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      ch.id === currentChapterId 
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="truncate pr-2">{ch.title}</span>
                    {ch.id === currentChapterId && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))
              )}

              {drawerTab === 'bookmarks' && (
                <div className="space-y-2.5">
                  {bookmarks.length > 0 ? (
                    bookmarks.map(bm => (
                      <div 
                        key={bm.id} 
                        className={`p-3 rounded-xl border text-xs ${currentTheme.cardBg}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <button
                            onClick={() => {
                              loadChapter(bm.chapterId);
                              setDrawerOpen(false);
                            }}
                            className="font-bold hover:underline truncate text-left"
                          >
                            {bm.chapterTitle}
                          </button>
                          <button
                            onClick={() => handleDeleteBookmark(bm.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 shrink-0"
                            title="Delete Bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {bm.note && (
                          <p className="opacity-90 italic mb-1.5 font-medium">"{bm.note}"</p>
                        )}
                        <p className="text-[10px] opacity-50">
                          {new Date(bm.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 opacity-50 text-xs">
                      <Bookmark className="w-6 h-6 mx-auto mb-2 opacity-40" />
                      No bookmarks saved yet. Use the bookmark button on top to save your notes!
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {bookmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl p-5 border shadow-2xl ${currentTheme.cardBg}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <BookmarkPlus className="w-4 h-4 text-indigo-500" />
                Bookmark Chapter
              </h3>
              <button onClick={() => setBookmarkModalOpen(false)} className="opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs opacity-70 mb-3 truncate">
              {chapter?.title}
            </p>

            <form onSubmit={handleSaveBookmark}>
              <textarea
                rows={3}
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="Add an optional thought, highlight, or note..."
                className="w-full p-2.5 text-xs rounded-xl border border-black/15 dark:border-white/15 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/20 mb-3"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookmarkModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Bookmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
