import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Compass, BookmarkCheck, Feather, LogIn, LogOut, User, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, onOpenAuthorStudio }) {
  const { user, logout, setIsAuthModalOpen, quickDemoLogin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentView('explore')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Lumina<span className="text-indigo-600">Books</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                eReader 2.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'explore'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Catalog
            </button>

            <button
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setCurrentView('library');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'library'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              My Bookshelf
            </button>

            <button
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setCurrentView('author');
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'author'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Feather className="w-4 h-4" />
              Author Studio
            </button>
          </div>

          {/* Right Action: Demo Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Pill (Visible on all screen sizes) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="hidden sm:inline px-2 text-slate-500 font-medium">Demo:</span>
              <button
                onClick={() => quickDemoLogin('reader')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  user?.role === 'reader'
                    ? 'bg-white shadow-sm text-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Reader account (Elena)"
              >
                Reader
              </button>
              <button
                onClick={() => quickDemoLogin('author')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  user?.role === 'author'
                    ? 'bg-white shadow-sm text-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Author account (Dr. Marcus)"
              >
                Author
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-sm"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('library');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-slate-400" />
                      My Bookshelf
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('author');
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Feather className="w-4 h-4 text-slate-400" />
                      Author Studio
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
