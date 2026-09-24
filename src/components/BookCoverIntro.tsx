import React, { useState } from 'react';
import { Heart, Sparkles, BookOpen, Music, Volume2, Star, Lock, Key, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface BookCoverIntroProps {
  recipientName: string;
  senderName: string;
  coverTitle: string;
  coverSubtitle: string;
  onOpenBook: () => void;
  onTriggerRain?: () => void;
}

export const BookCoverIntro: React.FC<BookCoverIntroProps> = ({
  recipientName,
  senderName,
  coverTitle,
  coverSubtitle,
  onOpenBook,
  onTriggerRain,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [ribbonUntied, setRibbonUntied] = useState(false);

  const handleOpen = () => {
    setRibbonUntied(true);
    romanticAudio.playPageTurnSound();
    romanticAudio.playSurpriseChime();
    setIsOpening(true);

    setTimeout(() => {
      onOpenBook();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
      {/* Ambient background particles & glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-500/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[700px] rounded-full bg-amber-400/5 blur-[140px]" />
      </div>

      {/* Main Closed Book Showcase Container */}
      <div
        className={`relative z-10 max-w-xl w-full flex flex-col items-center justify-center transition-all duration-700 ${
          isOpening ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Floating Tag Header */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-amber-200 backdrop-blur-md shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Colección Especial de Recuerdos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="font-bold">500 Páginas</span>
          </span>
        </div>

        {/* 3D Realistic Closed Book */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full max-w-md aspect-[3/4] rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] border-[3px] border-amber-400/50 p-5 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer group transition-transform duration-500 hover:-translate-y-1"
          style={{
            background: 'linear-gradient(145deg, #1a2639 0%, #111a28 60%, #0d141f 100%)',
          }}
          onClick={handleOpen}
        >
          {/* Book Spine Texture on Left Edge */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20 border-r border-white/10 pointer-events-none" />
          
          {/* Golden Corner Filigree Ornaments */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-amber-400/80 text-xl select-none">⚜</div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-amber-400/80 text-xl select-none">⚜</div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-amber-400/80 text-xl select-none">⚜</div>
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-amber-400/80 text-xl select-none">⚜</div>

          {/* Double Gold Embossed Framing Border */}
          <div className="absolute inset-3 sm:inset-4 border-2 border-amber-400/40 rounded-xl pointer-events-none" />
          <div className="absolute inset-5 sm:inset-6 border border-amber-300/25 rounded-lg pointer-events-none" />

          {/* Golden Ribbon tied vertically */}
          <div
            className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-9 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 shadow-lg z-25 pointer-events-none transition-all duration-500 ${
              ribbonUntied ? 'opacity-0 scale-y-0' : 'opacity-95'
            }`}
          >
            <div className="w-full h-full opacity-30 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:4px_4px]" />
          </div>

          {/* Golden Ribbon tied horizontally */}
          <div
            className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 sm:h-9 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-500 shadow-lg z-25 pointer-events-none transition-all duration-500 ${
              ribbonUntied ? 'opacity-0 scale-x-0' : 'opacity-95'
            }`}
          />

          {/* Center Wax Seal / Medallion with Monogram */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-600 p-1 shadow-[0_10px_25px_rgba(225,29,72,0.6)] flex items-center justify-center border-2 border-amber-300 animate-pulse">
              <div className="w-full h-full rounded-full border border-dashed border-amber-200/80 flex flex-col items-center justify-center text-amber-100">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-200 text-amber-200 drop-shadow" />
                <span className="text-[10px] sm:text-xs font-bold font-mono tracking-widest uppercase mt-0.5">
                  M & M
                </span>
              </div>
            </div>
          </div>

          {/* Top Section: Recipient & Dedication */}
          <div className="relative z-10 pl-6 sm:pl-8 text-center pt-2">
            <p className="text-[11px] sm:text-xs text-amber-300 font-semibold tracking-widest uppercase font-mono mb-1">
              Edición Única & Exclusiva
            </p>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {coverTitle || 'Nuestro Scrapbook'}
            </h1>
            <p className="text-xs text-sky-200/80 italic mt-0.5 max-w-xs mx-auto truncate">
              {coverSubtitle || '500 Páginas de momentos que duran para siempre'}
            </p>
          </div>

          {/* Bottom Section: For whom and from whom + Call to action */}
          <div className="relative z-10 pl-6 sm:pl-8 text-center pb-2">
            {/* Dedication Tag Box */}
            <div className="bg-black/40 backdrop-blur-sm border border-amber-400/30 rounded-xl p-2.5 mb-3 shadow-inner">
              <p className="text-xs text-slate-300">
                Para el amor de mi vida: <span className="font-bold text-amber-300">{recipientName || 'Marcelololelo'}</span>
              </p>
              <p className="text-[11px] text-rose-300 mt-0.5">
                De: <span className="font-semibold">{senderName || 'Tu Niña Hermosa'}</span>
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-200 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-400/40 group-hover:bg-amber-500/40 transition">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Haz clic para abrir el libro</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Action Button underneath */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleOpen}
            className="crystal-btn px-8 py-3 rounded-2xl text-sky-950 font-extrabold text-sm flex items-center gap-2.5 shadow-[0_10px_30px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95 transition-transform"
          >
            <BookOpen className="w-4 h-4 text-sky-900" />
            <span>Abrir Nuestro Libro de 500 Páginas</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </button>

          {onTriggerRain && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerRain();
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <span>🥟</span>
              <span>Lluvia de Empanadas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
