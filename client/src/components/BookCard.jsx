import React from 'react';
import { Star, BookOpen, Clock, Heart } from 'lucide-react';

export default function BookCard({ book, onSelectBook, onReadNow }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Book Cover Container */}
      <div 
        onClick={() => onSelectBook(book)}
        className="relative h-64 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-xs text-white font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Click for synopsis & chapters
          </span>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
          {book.category}
        </span>

        {/* Pricing Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-full shadow-sm ${
          book.price === 0
            ? 'bg-emerald-500 text-white'
            : 'bg-white/95 text-slate-900 border border-slate-200'
        }`}>
          {book.price === 0 ? 'FREE' : `$${book.price.toFixed(2)}`}
        </span>
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Rating & Pages */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{book.rating || '5.0'}</span>
            <span className="text-slate-400 font-normal">({book.reviewsCount || 0})</span>
          </div>
          <span className="text-slate-400">{book.pages || 250} pages</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectBook(book)}
          className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer mb-1"
        >
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-slate-500 mb-3 font-medium">by {book.author}</p>

        {/* Description Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {book.description}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 mt-auto">
          <button
            onClick={() => onSelectBook(book)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onReadNow(book)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Read
          </button>
        </div>

      </div>

    </div>
  );
}
