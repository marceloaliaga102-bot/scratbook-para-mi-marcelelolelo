import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Sparkles,
  Maximize2,
  Edit3,
  Camera,
  Mail,
  Calendar,
  Quote,
  Music,
} from 'lucide-react';
import { BookPage, BookData, ThemeSettings } from '../types';
import { romanticAudio } from '../utils/audio';

interface RealisticBookProps {
  bookData: BookData;
  isAdmin: boolean;
  onEditPage: (page: BookPage) => void;
  onQuickUploadPhoto: (pageId: string, photoField: 'photoUrl' | 'secondaryPhotoUrl') => void;
}

export const RealisticBook: React.FC<RealisticBookProps> = ({
  bookData,
  isAdmin,
  onEditPage,
  onQuickUploadPhoto,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [zoomedImage, setZoomedImage] = useState<{ url: string; caption?: string } | null>(null);
  const [letterOpened, setLetterOpened] = useState(false);

  const pages = bookData.pages;
  const currentPage = pages[currentPageIndex] || pages[0];

  // Turn to Next Page
  const turnNext = () => {
    if (currentPageIndex >= pages.length - 1 || isFlipping) return;
    romanticAudio.playPageTurnSound();
    setFlipDirection('next');
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
      setIsFlipping(false);
    }, 450);
  };

  // Turn to Previous Page
  const turnPrev = () => {
    if (currentPageIndex <= 0 || isFlipping) return;
    romanticAudio.playPageTurnSound();
    setFlipDirection('prev');
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      setIsFlipping(false);
    }, 450);
  };

  const jumpToPage = (index: number) => {
    if (index === currentPageIndex || isFlipping) return;
    romanticAudio.playPageTurnSound();
    setFlipDirection(index > currentPageIndex ? 'next' : 'prev');
    setIsFlipping(true);

    setTimeout(() => {
      setCurrentPageIndex(index);
      setIsFlipping(false);
    }, 450);
  };

  // Background tone mapping
  const pageBackgroundClasses: Record<ThemeSettings['pageTone'], string> = {
    cream: 'bg-[#faf6ee] text-[#2c1d11]',
    sepia: 'bg-[#f4ebd0] text-[#332211]',
    vintage: 'bg-[#ebdcb9] text-[#281a0e]',
    'warm-pink': 'bg-[#fff1f2] text-[#4c0519]',
  };

  // Render individual page content
  const renderPageBody = (page: BookPage) => {
    switch (page.type) {
      case 'cover':
        return (
          <div className="flex flex-col items-center justify-between h-full text-center px-4 py-6 sm:px-10 sm:py-8 relative overflow-hidden select-none">
            {/* Ornamental Victorian Border */}
            <div className="absolute inset-3 border-2 border-amber-500/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-5 border border-amber-400/25 rounded-xl pointer-events-none" />

            {/* Corner Filigrees */}
            <div className="absolute top-4 left-4 text-amber-500/60 text-lg">⚜</div>
            <div className="absolute top-4 right-4 text-amber-500/60 text-lg">⚜</div>
            <div className="absolute bottom-4 left-4 text-amber-500/60 text-lg">⚜</div>
            <div className="absolute bottom-4 right-4 text-amber-500/60 text-lg">⚜</div>

            {/* Top Chapter Tag */}
            <div className="flex items-center gap-2 text-amber-700/80 font-bold uppercase tracking-widest text-[11px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{bookData.specialDate || 'Edición Especial de Amor'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            {/* Title & Subtitle */}
            <div className="my-2">
              <h1
                className="text-3xl sm:text-5xl font-black text-rose-900 tracking-tight leading-tight drop-shadow-sm"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {bookData.title}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-amber-900/80 font-medium italic">
                {bookData.subtitle}
              </p>
            </div>

            {/* Main Cover Portrait */}
            {page.photoUrl && (
              <div className="relative group my-3">
                <div className="relative w-44 h-44 sm:w-60 sm:h-60 rounded-3xl p-2 bg-gradient-to-tr from-amber-200 via-rose-200 to-amber-100 shadow-[0_12px_28px_rgba(0,0,0,0.25)] border-2 border-amber-400/60">
                  <img
                    src={page.photoUrl}
                    alt={page.photoCaption || 'Foto de Portada'}
                    className="w-full h-full object-cover rounded-2xl cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                    onClick={() => setZoomedImage({ url: page.photoUrl!, caption: page.photoCaption })}
                  />
                  <button
                    onClick={() => setZoomedImage({ url: page.photoUrl!, caption: page.photoCaption })}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Ver en grande"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => onQuickUploadPhoto(page.id, 'photoUrl')}
                      className="absolute bottom-4 right-4 p-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
                      title="Cambiar Foto"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {page.photoCaption && (
                  <p className="mt-2 text-xs font-semibold text-rose-800 italic">
                    "{page.photoCaption}"
                  </p>
                )}
              </div>
            )}

            {/* Dedication Text */}
            <div className="max-w-md my-2">
              <p
                className="text-lg sm:text-2xl text-amber-950 font-bold leading-snug"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Para: <span className="text-rose-700">{bookData.recipientName}</span>
              </p>
              <p className="text-xs sm:text-sm text-stone-700 font-medium mt-1 px-4 leading-relaxed">
                {page.content}
              </p>
            </div>

            {/* Bottom prompt to open */}
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600/90 animate-pulse mt-1">
              <span>Pasa la página para comenzar</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        );

      case 'reasons':
        return (
          <div className="flex flex-col h-full justify-between p-6 sm:p-10 select-none">
            <div>
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  {page.chapterTitle}
                </span>
                <span className="text-xs text-stone-500 font-mono">Pág. {page.pageNumber}</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-bold text-rose-950 mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {page.pageTitle}
              </h2>
              {page.subtitle && (
                <p className="text-xs sm:text-sm text-amber-900/80 italic mb-4">
                  {page.subtitle}
                </p>
              )}

              <p className="text-sm text-stone-700 mb-4">{page.content}</p>

              {/* Reasons list with cute heart bullet points */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {page.extraData?.reasonsList?.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-500/10 hover:bg-rose-500/10 border border-amber-900/10 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="w-3 h-3 fill-rose-500" />
                    </div>
                    <span
                      className="text-base sm:text-lg text-stone-800 leading-snug font-medium"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {page.quote && (
              <div className="mt-4 pt-3 border-t border-amber-900/15 text-center">
                <p
                  className="text-base sm:text-lg text-rose-800 italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {page.quote}
                </p>
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="flex flex-col h-full justify-between p-6 sm:p-10 select-none">
            <div>
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  {page.chapterTitle}
                </span>
                <span className="text-xs text-stone-500 font-mono">Pág. {page.pageNumber}</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-bold text-rose-950 mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {page.pageTitle}
              </h2>
              {page.subtitle && (
                <p className="text-xs sm:text-sm text-amber-900/80 italic mb-3">
                  {page.subtitle}
                </p>
              )}

              {/* Gallery Grid: Polaroid snapshots */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 my-2">
                {page.extraData?.galleryImages?.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    onClick={() => setZoomedImage({ url: img.url, caption: img.caption })}
                    className="group bg-white p-2 sm:p-2.5 rounded-xl shadow-md border border-stone-200 cursor-pointer transform hover:-rotate-1 hover:scale-105 transition-all"
                  >
                    <div className="w-full h-24 sm:h-32 rounded-lg overflow-hidden relative">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                    <p
                      className="mt-1.5 text-center text-xs sm:text-sm text-stone-800 truncate"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {img.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-stone-500 italic mt-2">
              ✨ Toca cualquier foto para expandir el recuerdo con amor.
            </div>
          </div>
        );

      case 'letter':
        return (
          <div className="flex flex-col h-full justify-between p-6 sm:p-10 select-none">
            <div>
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  {page.chapterTitle}
                </span>
                <span className="text-xs text-stone-500 font-mono">Pág. {page.pageNumber}</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-bold text-rose-950 mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {page.pageTitle}
              </h2>
              {page.subtitle && (
                <p className="text-xs sm:text-sm text-amber-900/80 italic mb-4">
                  {page.subtitle}
                </p>
              )}

              {/* Secret Romantic Envelope */}
              {!letterOpened ? (
                <div
                  onClick={() => {
                    setLetterOpened(true);
                    romanticAudio.playSurpriseChime();
                  }}
                  className="my-6 p-6 rounded-3xl bg-gradient-to-br from-amber-100 to-rose-100 border-2 border-dashed border-rose-400 cursor-pointer text-center group hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h4
                    className="text-xl sm:text-2xl font-bold text-rose-900 mt-4"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    Carta Sellada con Amor
                  </h4>
                  <p className="text-xs text-rose-700 mt-1">
                    Solo para los ojos de mi osito. Haz clic aquí para romper el sello. 💌
                  </p>
                </div>
              ) : (
                <div className="relative p-5 rounded-2xl bg-amber-500/10 border border-rose-300/60 shadow-inner">
                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <p
                      className="text-lg sm:text-xl text-stone-900 leading-relaxed whitespace-pre-line"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      {page.content}
                    </p>
                  </div>
                  {page.extraData?.signature && (
                    <div
                      className="mt-4 text-right text-lg sm:text-xl font-bold text-rose-800"
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {page.extraData.signature}
                    </div>
                  )}
                </div>
              )}
            </div>

            {page.quote && (
              <div className="mt-4 pt-2 border-t border-amber-900/15 text-center">
                <p
                  className="text-sm sm:text-base text-rose-800 italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {page.quote}
                </p>
              </div>
            )}
          </div>
        );

      case 'backcover':
        return (
          <div className="flex flex-col items-center justify-between h-full text-center p-6 sm:p-10 relative overflow-hidden select-none">
            {/* Ornamental Frame */}
            <div className="absolute inset-4 border-2 border-amber-500/40 rounded-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-amber-700/80 font-bold uppercase tracking-widest text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Eternamente Juntos</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="my-auto max-w-sm">
              <h2
                className="text-3xl sm:text-5xl font-black text-rose-950 mb-2 leading-tight"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {page.pageTitle}
              </h2>
              <p
                className="text-lg sm:text-2xl text-stone-800 leading-relaxed my-4 whitespace-pre-line"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {page.content}
              </p>

              {/* Realistic Red Wax Seal */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-950 border-4 border-amber-400/80 shadow-[0_8px_20px_rgba(159,18,57,0.5)] flex items-center justify-center my-4 transform hover:scale-105 transition-transform">
                <div className="text-center text-amber-200">
                  <span className="text-xl">🐻</span>
                  <div className="text-[9px] uppercase font-bold tracking-widest font-mono">AMOR</div>
                </div>
              </div>

              {page.quote && (
                <p
                  className="text-sm sm:text-base text-rose-800 italic mt-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {page.quote}
                </p>
              )}
            </div>

            <button
              onClick={() => jumpToPage(0)}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
            >
              Releer Desde el Principio 📖
            </button>
          </div>
        );

      case 'playlist':
      case 'story':
      default:
        return (
          <div className="flex flex-col h-full justify-between p-6 sm:p-10 select-none">
            <div>
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                  {page.chapterTitle}
                </span>
                <span className="text-xs text-stone-500 font-mono">Pág. {page.pageNumber}</span>
              </div>

              {/* Title & subtitle */}
              <h2
                className="text-2xl sm:text-4xl font-bold text-rose-950 mb-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {page.pageTitle}
              </h2>
              {page.subtitle && (
                <p className="text-xs sm:text-sm text-amber-900/80 italic mb-3">
                  {page.subtitle}
                </p>
              )}

              {/* Main Content Layout with Photo */}
              <div className="flex flex-col sm:flex-row gap-4 my-2">
                {page.photoUrl && (
                  <div className="relative group shrink-0 mx-auto sm:mx-0 w-44 sm:w-52">
                    <div className="p-2 bg-white rounded-2xl shadow-md border border-stone-200">
                      <img
                        src={page.photoUrl}
                        alt={page.photoCaption || 'Foto'}
                        className="w-full h-36 sm:h-44 object-cover rounded-xl cursor-pointer"
                        onClick={() => setZoomedImage({ url: page.photoUrl!, caption: page.photoCaption })}
                      />
                      {page.photoCaption && (
                        <p
                          className="mt-1.5 text-center text-xs text-stone-700 italic"
                          style={{ fontFamily: "'Caveat', cursive" }}
                        >
                          "{page.photoCaption}"
                        </p>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => onQuickUploadPhoto(page.id, 'photoUrl')}
                        className="absolute bottom-4 right-4 p-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
                        title="Cambiar foto"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Text paragraph */}
                <div className="flex-1 max-h-[260px] overflow-y-auto pr-1">
                  <p
                    className="text-base sm:text-xl text-stone-800 leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {page.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Quote & Date */}
            {page.quote && (
              <div className="mt-3 pt-3 border-t border-amber-900/15 flex items-center justify-between text-xs sm:text-sm text-stone-600">
                <p
                  className="text-rose-800 italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {page.quote}
                </p>
                {page.date && <span className="font-mono text-[11px]">{page.date}</span>}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto my-6 px-3 sm:px-6">
      {/* 3D Realistic Book Shell */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[720px] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.65)] p-2 sm:p-4 bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-4 border-amber-600/40">
        {/* Leather spine effect */}
        <div className="absolute left-1 sm:left-2 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-black/60 via-transparent to-black/40 rounded-l-2xl z-20 pointer-events-none" />

        {/* Golden Silk Bookmark Ribbon */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-12 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-md rounded-b-md z-30 pointer-events-none border-t border-amber-200">
          <div className="absolute bottom-0 left-0 right-0 h-3 border-b-4 border-l-3 border-r-3 border-transparent" />
        </div>

        {/* Open Book Pages Container */}
        <div className="relative w-full h-full flex rounded-2xl overflow-hidden shadow-inner">
          {/* Center Spine Crease Gradient Shadow */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 sm:w-16 bg-gradient-to-r from-black/25 via-black/10 to-black/25 pointer-events-none z-20" />

          {/* Left Page (Desktop Spread or Background Page) */}
          <div
            className={`hidden sm:flex flex-1 ${pageBackgroundClasses[bookData.theme.pageTone]} border-r border-stone-300/40 relative shadow-inner overflow-hidden`}
          >
            {/* If we are past cover, show previous page preview or left decorative side */}
            {currentPageIndex > 0 ? (
              renderPageBody(pages[currentPageIndex - 1])
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-amber-900/60 select-none">
                <BookOpen className="w-16 h-16 mb-4 stroke-1 opacity-40 text-amber-800" />
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  Nuestro Libro Secreto
                </h3>
                <p className="text-sm mt-2 max-w-xs italic">
                  «Cada recuerdo juntos es un tesoro que brilla para siempre.»
                </p>
                <div className="mt-6 text-3xl">🐻❤️🥟</div>
              </div>
            )}
          </div>

          {/* Right Page (Active Page with 3D Flip animation) */}
          <div
            className={`flex-1 ${pageBackgroundClasses[bookData.theme.pageTone]} relative shadow-inner overflow-hidden transition-transform duration-500 origin-left ${
              isFlipping
                ? flipDirection === 'next'
                  ? 'rotate-y-[-18deg] scale-[0.98] brightness-95'
                  : 'rotate-y-[18deg] scale-[0.98] brightness-95'
                : 'rotate-y-0 scale-100'
            }`}
          >
            {/* Quick Admin Edit Button on active page */}
            {isAdmin && (
              <button
                onClick={() => onEditPage(currentPage)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-transform active:scale-95"
                title="Editar esta página"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {renderPageBody(currentPage)}
          </div>
        </div>
      </div>

      {/* Book Navigation Controls & Page Slider */}
      <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-rose-500/25 shadow-xl text-white">
        {/* Previous Button */}
        <button
          onClick={turnPrev}
          disabled={currentPageIndex === 0 || isFlipping}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-rose-600/80 disabled:opacity-30 disabled:hover:bg-white/10 text-xs sm:text-sm font-semibold transition-all shadow active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Página Anterior</span>
        </button>

        {/* Chapter & Page Jump selector */}
        <div className="flex items-center gap-3">
          <select
            value={currentPageIndex}
            onChange={(e) => jumpToPage(parseInt(e.target.value))}
            className="bg-slate-800 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-rose-400 cursor-pointer"
          >
            {pages.map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.pageNumber}. {p.chapterTitle} - {p.pageTitle}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-300 font-mono">
            {currentPageIndex + 1} / {pages.length}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={turnNext}
          disabled={currentPageIndex >= pages.length - 1 || isFlipping}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-rose-900/40 active:scale-95"
        >
          <span>Siguiente Página</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom Image Lightbox Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 rounded-3xl p-4 border border-rose-500/40 shadow-2xl text-center"
          >
            <img
              src={zoomedImage.url}
              alt={zoomedImage.caption || 'Recuerdo'}
              className="w-full max-h-[75vh] object-contain rounded-2xl mx-auto shadow-lg"
            />
            {zoomedImage.caption && (
              <p
                className="mt-3 text-lg sm:text-2xl text-rose-200 font-medium"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                "{zoomedImage.caption}"
              </p>
            )}
            <button
              onClick={() => setZoomedImage(null)}
              className="mt-3 px-5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
