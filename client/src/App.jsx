import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BookDetailModal from './components/BookDetailModal';
import ReaderView from './components/ReaderView';
import ExploreView from './views/ExploreView';
import LibraryView from './views/LibraryView';
import AuthorStudioView from './views/AuthorStudioView';

function AppContent() {
  const { user } = useAuth();
  
  // Navigation: 'explore' | 'library' | 'author' | 'reader'
  const [currentView, setCurrentView] = useState('explore');
  
  // Modals & Reader state
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [readerState, setReaderState] = useState({
    bookId: null,
    chapterId: null
  });

  const handleOpenReader = (bookId, chapterId = null) => {
    setSelectedBookForDetails(null);
    setReaderState({ bookId, chapterId });
    setCurrentView('reader');
  };

  const handleBackFromReader = () => {
    setCurrentView('library');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* If reader is active, render ReaderView fullscreen */}
      {currentView === 'reader' && readerState.bookId ? (
        <ReaderView
          bookId={readerState.bookId}
          initialChapterId={readerState.chapterId}
          onBackToLibrary={handleBackFromReader}
        />
      ) : (
        <>
          {/* Top Navbar */}
          <Navbar 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            onOpenAuthorStudio={() => setCurrentView('author')}
          />

          {/* Main Content Area */}
          <main className="flex-grow">
            {currentView === 'explore' && (
              <ExploreView
                onSelectBook={(book) => setSelectedBookForDetails(book)}
                onStartReading={(bookId, chapterId) => handleOpenReader(bookId, chapterId)}
              />
            )}

            {currentView === 'library' && (
              <LibraryView
                onStartReading={(bookId, chapterId) => handleOpenReader(bookId, chapterId)}
                onSelectBook={(book) => setSelectedBookForDetails(book)}
                onExploreClick={() => setCurrentView('explore')}
              />
            )}

            {currentView === 'author' && (
              <AuthorStudioView
                onStartReading={(bookId, chapterId) => handleOpenReader(bookId, chapterId)}
                onSelectBook={(book) => setSelectedBookForDetails(book)}
              />
            )}
          </main>

          {/* Global Footer */}
          <footer className="bg-white border-t border-slate-200 py-8 mt-16 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-semibold text-slate-700">
                Lumina<span className="text-indigo-600">Books</span> Platform • Full-Stack Digital Bookstore & In-Browser eReader
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Express & Node.js API</span>
                <span>•</span>
                <span>React & Tailwind CSS</span>
                <span>•</span>
                <span>Zero-Friction In-Memory DB</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Global Modals */}
      <AuthModal />

      {selectedBookForDetails && (
        <BookDetailModal
          bookId={selectedBookForDetails.id}
          onClose={() => setSelectedBookForDetails(null)}
          onStartReading={(bookId, chapterId) => handleOpenReader(bookId, chapterId)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
