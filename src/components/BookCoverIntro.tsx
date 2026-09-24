import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, BookOpen, Music, Volume2, VolumeX, ArrowRight, Star } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(false);
  
  // Mouse 3D tilt tracking for realistic physical hardcover book presence
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 50, relY: 50 });
  const bookRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bookRef.current || isOpening) return;
    const rect = bookRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (max ~8 degrees for realism)
    const tiltX = ((y - centerY) / centerY) * -6;
    const tiltY = ((x - centerX) / centerX) * 6;

    setMousePos({
      x: tiltX,
      y: tiltY,
      relX: Math.round((x / rect.width) * 100),
      relY: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0, relX: 50, relY: 50 });
  };

  // Trigger high-end 3D book opening sequence
  const handleOpen = () => {
    if (isOpening) return;

    if (!isMuted) {
      romanticAudio.playSurpriseChime();
    }
    setRibbonUntied(true);
    setIsOpening(true);

    // Stage 2: Page flip & creak sound as the cover swings open
    setTimeout(() => {
      if (!isMuted) {
        romanticAudio.playPageTurnSound();
      }
    }, 320);

    // Stage 3: Smooth transition into the opened book spread
    setTimeout(() => {
      onOpenBook();
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      {/* Ambient background particles & cosmic glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-600/15 blur-[140px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/15 blur-[140px] animate-pulse"
          style={{ animationDelay: '2.5s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[750px] rounded-full bg-amber-400/5 blur-[160px]" />

        {/* Ambient floating dust particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:32px_32px] opacity-60" />
      </div>

      {/* Top Floating Controls (Sound & Emoticons) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2">
        {onTriggerRain && (
          <button
            onClick={onTriggerRain}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition hover:scale-105"
            title="¡Lluvia de empanadas doradas!"
          >
            <span className="text-sm">🥟</span>
            <span className="hidden sm:inline">Lluvia de Empanadas</span>
          </button>
        )}

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sky-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition hover:scale-105"
          title={isMuted ? 'Activar Sonidos' : 'Silenciar Sonidos'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          <span className="hidden sm:inline">{isMuted ? 'Silencio' : 'Sonido On'}</span>
        </button>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center justify-center my-auto py-6">
        {/* Floating Royal Tag */}
        <div
          className={`mb-5 text-center transition-all duration-700 ${
            isOpening ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-amber-400/30 text-xs text-amber-200 backdrop-blur-xl shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="tracking-wide uppercase font-semibold text-[11px] text-amber-100">
              Edición Única & Personalizada
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            <span className="font-extrabold text-amber-300 font-mono">500 Páginas</span>
          </span>
        </div>

        {/* 3D BOOK STAGE WITH PERSPECTIVE */}
        <div
          className="relative w-full max-w-[440px] sm:max-w-[480px] perspective-2000"
          style={{ perspective: '2200px' }}
        >
          {/* Outer Glowing Light Rays (Emanating as the book opens) */}
          {isOpening && (
            <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
              <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-300/60 via-yellow-100/80 to-amber-400/60 blur-[60px] animate-light-rays" />
              <div className="absolute w-72 h-72 rounded-full bg-white/90 blur-[40px] animate-pulse" />
            </div>
          )}

          {/* Realistic Cast Shadow on the Table */}
          <div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/80 blur-2xl rounded-full transition-all duration-700 pointer-events-none ${
              isOpening ? 'scale-125 opacity-40' : isHovered ? 'scale-105 opacity-90' : 'scale-95 opacity-70'
            }`}
          />

          {/* 3D HARDCOVER BOOK WRAPPER */}
          <div
            ref={bookRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={handleOpen}
            className="relative w-full aspect-[3/4] preserve-3d cursor-pointer select-none transition-transform duration-300 ease-out"
            style={{
              transform: isOpening
                ? 'scale(1.08) translateZ(50px)'
                : isHovered
                ? `rotateX(${mousePos.x}deg) rotateY(${mousePos.y}deg) translateY(-8px)`
                : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
            }}
          >
            {/* ================= THICK GOLDEN PAGE BLOCK (SIDE & BOTTOM EDGES) ================= */}
            {/* Right page edge: represents 500 gold-gilded stacked pages */}
            <div
              className="absolute top-3 bottom-3 right-0 w-5 rounded-r-sm gilded-page-edges pointer-events-none z-10 border-l border-black/40 shadow-inner"
              style={{
                transform: 'translateX(100%) rotateY(90deg)',
                transformOrigin: 'left center',
              }}
            />

            {/* Bottom page edge */}
            <div
              className="absolute bottom-0 left-6 right-2 h-4 gilded-page-edges-bottom pointer-events-none z-10 border-t border-black/40"
              style={{
                transform: 'translateY(100%) rotateX(-90deg)',
                transformOrigin: 'top center',
              }}
            />

            {/* ================= INSIDE REVEAL (UNDER COVER) ================= */}
            {/* The first opened page glowing inside as the cover swings open */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-[#fbf9f2] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-amber-900/30 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-paper-texture opacity-80" />
              <div className="relative z-10 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-rose-500 shadow-md">
                  <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
                </div>
                <h3 className="font-fancy text-3xl sm:text-4xl text-rose-950 font-bold">
                  {coverTitle || 'Nuestro Scrapbook'}
                </h3>
                <p className="font-hand text-xl text-rose-800">
                  Para {recipientName || 'Marcelololelo'} ♥
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  <span>Abriendo 500 páginas de amor...</span>
                </div>
              </div>
            </div>

            {/* ================= 3D FRONT HARDCOVER (SWINGS OPEN ON HINGE) ================= */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border-2 border-amber-400/60 preserve-3d"
              style={{
                transformOrigin: 'left center',
                transition: 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease',
                transform: isOpening ? 'rotateY(-125deg)' : 'rotateY(0deg)',
                background: 'radial-gradient(ellipse at 35% 25%, #1c2738 0%, #101826 60%, #090e17 100%)',
              }}
            >
              {/* Genuine Leather Texture & Grain Filter Overlay */}
              <div className="absolute inset-0 book-leather-texture pointer-events-none opacity-95" />

              {/* Dynamic Mouse Sheen / Specular Light Reflection */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 350px at ${mousePos.relX}% ${mousePos.relY}%, rgba(254, 243, 199, 0.25) 0%, transparent 80%)`,
                }}
              />

              {/* Diagonal Foil Shimmer sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
                <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-amber-200/15 to-transparent foil-gleam-effect" />
              </div>

              {/* ================= HARDCOVER SPINE (LEFT EDGE) ================= */}
              <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-20 border-r border-amber-400/30 pointer-events-none flex flex-col justify-around py-8 items-center">
                {/* 4 Raised Stitched Spine Ribs (Costillas artesanales en relieve) */}
                <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md" />
                <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md" />
                <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md" />
                <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 shadow-md" />
              </div>

              {/* Stitched seam border along the inner edge of cover */}
              <div className="absolute inset-2 sm:inset-3 border border-dashed border-amber-300/30 rounded-xl pointer-events-none" />

              {/* ================= LUXURY CORNER BRACKETS (ANTIQUE GOLD FILIGREE) ================= */}
              {/* Top-Left Corner */}
              <svg className="absolute top-2 left-2 sm:top-3 sm:left-3 w-8 h-8 text-amber-300/80 pointer-events-none drop-shadow" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z M6,6 L26,6 C20,12 12,20 6,26 Z" />
                <circle cx="8" cy="8" r="2" fill="#fef08a" />
              </svg>

              {/* Top-Right Corner */}
              <svg className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 text-amber-300/80 pointer-events-none drop-shadow scale-x-[-1]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z M6,6 L26,6 C20,12 12,20 6,26 Z" />
                <circle cx="8" cy="8" r="2" fill="#fef08a" />
              </svg>

              {/* Bottom-Left Corner */}
              <svg className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-8 h-8 text-amber-300/80 pointer-events-none drop-shadow scale-y-[-1]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z M6,6 L26,6 C20,12 12,20 6,26 Z" />
                <circle cx="8" cy="8" r="2" fill="#fef08a" />
              </svg>

              {/* Bottom-Right Corner */}
              <svg className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 text-amber-300/80 pointer-events-none drop-shadow scale-[-1]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z M6,6 L26,6 C20,12 12,20 6,26 Z" />
                <circle cx="8" cy="8" r="2" fill="#fef08a" />
              </svg>

              {/* Double Gold-Embossed Victorian Framing Border */}
              <div className="absolute inset-4 sm:inset-5 border-2 border-amber-400/40 rounded-xl pointer-events-none shadow-[inset_0_0_15px_rgba(212,175,55,0.15)]" />
              <div className="absolute inset-6 sm:inset-7 border border-amber-300/25 rounded-lg pointer-events-none" />

              {/* ================= SATIN RIBBONS & WAX SEAL ================= */}
              {/* Vertical Satin Ribbon */}
              <div
                className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-10 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-600 shadow-xl z-20 pointer-events-none transition-all duration-700 ${
                  ribbonUntied ? 'opacity-0 scale-y-0' : 'opacity-95 scale-y-100'
                }`}
              >
                <div className="w-full h-full opacity-35 bg-[radial-gradient(circle,rgba(255,255,255,0.85)_1px,transparent_1px)] bg-[length:3px_3px]" />
                <div className="absolute inset-y-0 left-0 w-1 bg-black/20" />
                <div className="absolute inset-y-0 right-0 w-1 bg-black/20" />
              </div>

              {/* Horizontal Satin Ribbon */}
              <div
                className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 sm:h-10 bg-gradient-to-b from-amber-700 via-amber-400 to-amber-600 shadow-xl z-20 pointer-events-none transition-all duration-700 ${
                  ribbonUntied ? 'opacity-0 scale-x-0' : 'opacity-95 scale-x-100'
                }`}
              >
                <div className="w-full h-full opacity-35 bg-[radial-gradient(circle,rgba(255,255,255,0.85)_1px,transparent_1px)] bg-[length:3px_3px]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-black/20" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20" />
              </div>

              {/* Center 3D Wax Seal with Monogram & Heart */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 ${
                  ribbonUntied ? 'scale-150 opacity-0 rotate-45' : isHovered ? 'scale-110' : 'scale-100'
                }`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-red-900 p-1 shadow-[0_12px_30px_rgba(225,29,72,0.65),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center border-2 border-amber-300">
                  {/* Organic Wax Rim Edge irregularities */}
                  <div className="w-full h-full rounded-full border border-dashed border-amber-200/70 flex flex-col items-center justify-center text-amber-100 shadow-inner">
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-200 text-amber-200 drop-shadow-md animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-extrabold font-mono tracking-widest uppercase mt-0.5 text-amber-200 drop-shadow">
                      M & M
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= TOP SECTION: GOLD FOIL TITLE & MOTIF ================= */}
              <div className="relative z-10 pl-6 sm:pl-8 text-center pt-2">
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <p className="text-[10px] sm:text-xs text-amber-300/90 font-bold tracking-[0.2em] uppercase font-mono">
                    Edición Especial de Colección
                  </p>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>

                {/* Main Foil Title */}
                <h1
                  className="text-3xl sm:text-4xl font-extrabold gold-foil-text tracking-wide drop-shadow-lg leading-tight"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {coverTitle || 'Nuestro Scrapbook'}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-sky-200/90 font-hand tracking-wide mt-1 max-w-xs mx-auto drop-shadow truncate">
                  {coverSubtitle || '500 Páginas de momentos que duran para siempre'}
                </p>
              </div>

              {/* ================= CENTER MEDALLION AVATAR ================= */}
              <div className="relative z-10 my-auto pl-6 sm:pl-8 flex flex-col items-center">
                {/* Bear illustration in golden circular frame */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-rose-300 to-sky-300 shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5 relative group">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWpNdSVuq0o2aqmGVipejmexaZ2mzZQLDDGcx3TstkTJ15fIkH-mKV1mnzMueFoVwX2mWpDEU2s4mMg2ITcwEIQlyNTE8CZW4R5PbvNIlcqbjMHbP3hheC3zLB5WEIWL0cWb5BgtrTqQsgHvrTQm9MHKBaSsGZr891UYX5qcbUTpgoUakfSRHkJaKQCGqz_iWkGMtpzsIAAcnZY0xCtSE3rU05ExonrqbZ6rUQV1IoZwRCYoU8aZ5G0fh-AgAlbpZBoA"
                      alt="Ositos enamorados"
                      className="w-full h-full object-cover rounded-full animate-bears"
                    />
                  </div>
                </div>
              </div>

              {/* ================= BOTTOM SECTION: DEDICATION PLAQUE & HINT ================= */}
              <div className="relative z-10 pl-6 sm:pl-8 text-center pb-2">
                {/* Parchment Dedication Plaque */}
                <div className="bg-black/55 backdrop-blur-md border border-amber-400/40 rounded-xl p-3 mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
                  <p className="text-xs sm:text-sm text-slate-200">
                    Para el amor de mi vida:{' '}
                    <span className="font-extrabold text-amber-300 font-fancy text-base sm:text-lg">
                      {recipientName || 'Marcelololelo'}
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-rose-300 font-hand text-sm mt-0.5">
                    De: <span className="font-bold">{senderName || 'Tu Niña Hermosa'}</span> ♥
                  </p>
                </div>

                {/* Call to action badge */}
                <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-200 bg-amber-500/25 px-5 py-2 rounded-full border border-amber-400/50 shadow-lg group-hover:bg-amber-500/40 group-hover:scale-105 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Haz clic para abrir el libro</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button underneath */}
        <div
          className={`mt-6 flex flex-col sm:flex-row items-center gap-3 transition-all duration-700 ${
            isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <button
            onClick={handleOpen}
            className="crystal-btn px-8 py-3.5 rounded-2xl text-sky-950 font-extrabold text-sm sm:text-base flex items-center gap-3 shadow-[0_12px_35px_rgba(56,189,248,0.45)] hover:scale-105 active:scale-95 transition-all"
          >
            <BookOpen className="w-5 h-5 text-sky-900" />
            <span>Abrir Nuestro Libro de 500 Páginas</span>
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          </button>
        </div>

        {/* Subtle hint text */}
        <p
          className={`text-[11px] text-sky-200/60 font-mono mt-3 text-center transition-opacity duration-500 ${
            isOpening ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Toca la portada o el botón para vivir la experiencia completa con sonido y recuerdos
        </p>
      </div>
    </div>
  );
};
