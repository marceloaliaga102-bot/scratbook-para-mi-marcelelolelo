import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

export const AnimatedBears: React.FC = () => {
  // Bear walking position from 5% to 85% of screen width
  const [posX, setPosX] = useState(20);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isLoved, setIsLoved] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Smooth back and forth movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosX((prev) => {
        const step = direction === 'right' ? 0.35 : -0.35;
        const next = prev + step;

        if (next > 78) {
          setDirection('left');
          return 78;
        }
        if (next < 6) {
          setDirection('right');
          return 6;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [direction]);

  const cuteQuotes = [
    '¡Eres mi osito consentido! 🐻❤️',
    '¡Te amo un universo entero!',
    '¡Vamos por unas empanadas calientitas! 🥟',
    '¡Abacho fuerte fuerte!',
    '¡Siempre juntitos, mi amor!',
    '¡Eres mi persona favorita! ✨'
  ];

  const handleBearClick = () => {
    setIsLoved(true);
    const randomQuote = cuteQuotes[Math.floor(Math.random() * cuteQuotes.length)];
    setSpeechBubble(randomQuote);
    romanticAudio.playSurpriseChime();

    setTimeout(() => {
      setIsLoved(false);
    }, 1800);

    setTimeout(() => {
      setSpeechBubble(null);
    }, 4000);
  };

  return (
    <div
      style={{
        left: `${posX}%`,
        bottom: '18px',
      }}
      onClick={handleBearClick}
      className={`fixed z-25 cursor-pointer select-none transition-transform duration-300 group ${
        direction === 'left' ? 'scale-x-[-1]' : 'scale-x-100'
      }`}
    >
      {/* Speech bubble */}
      {speechBubble && (
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 text-rose-700 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg border border-rose-300 pointer-events-none animate-bounce ${
            direction === 'left' ? 'scale-x-[-1]' : ''
          }`}
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          {speechBubble}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/95" />
        </div>
      )}

      {/* Floating hearts on click */}
      {isLoved && (
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none animate-ping ${
            direction === 'left' ? 'scale-x-[-1]' : ''
          }`}
        >
          <span className="text-xl">💖</span>
          <span className="text-xl">✨</span>
          <span className="text-xl">🥟</span>
        </div>
      )}

      {/* Tender Couple Bears Graphic */}
      <div className="relative flex items-end gap-1 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]">
        {/* Brown Teddy Bear */}
        <div className="relative w-14 h-16 flex flex-col items-center animate-bounce" style={{ animationDuration: '0.8s' }}>
          {/* Ears */}
          <div className="absolute -top-1.5 left-1 w-4 h-4 rounded-full bg-amber-800 border-2 border-amber-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-600" />
          </div>
          <div className="absolute -top-1.5 right-1 w-4 h-4 rounded-full bg-amber-800 border-2 border-amber-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-600" />
          </div>

          {/* Head */}
          <div className="relative w-12 h-11 rounded-full bg-amber-700 border-2 border-amber-900 flex flex-col items-center justify-center shadow-inner">
            {/* Eyes */}
            <div className="flex justify-between w-6 mt-1">
              <div className="w-1.5 h-2 rounded-full bg-slate-900" />
              <div className="w-1.5 h-2 rounded-full bg-slate-900" />
            </div>
            {/* Blushing Cheeks */}
            <div className="flex justify-between w-9 -mt-1">
              <div className="w-2 h-1.5 rounded-full bg-rose-400/80 blur-[0.5px]" />
              <div className="w-2 h-1.5 rounded-full bg-rose-400/80 blur-[0.5px]" />
            </div>
            {/* Snout */}
            <div className="w-4 h-3 rounded-full bg-amber-200 border border-amber-800 flex items-center justify-center -mt-1">
              <div className="w-1.5 h-1 rounded-full bg-amber-950" />
            </div>
          </div>

          {/* Body */}
          <div className="relative w-11 h-8 -mt-2 rounded-t-lg rounded-b-2xl bg-amber-800 border-2 border-amber-900 flex items-center justify-center">
            {/* Belly patch */}
            <div className="w-5 h-4 rounded-full bg-amber-600/60" />
            {/* Tiny Heart held in paws */}
            <div className="absolute top-1 text-xs animate-pulse">❤️</div>
          </div>

          {/* Feet */}
          <div className="flex justify-between w-9 -mt-1">
            <div className="w-3.5 h-2.5 rounded-full bg-amber-900" />
            <div className="w-3.5 h-2.5 rounded-full bg-amber-900" />
          </div>
        </div>

        {/* White/Cream Little Bear Companion */}
        <div className="relative w-13 h-14 flex flex-col items-center animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }}>
          {/* Ears */}
          <div className="absolute -top-1.5 left-1 w-3.5 h-3.5 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-200" />
          </div>
          <div className="absolute -top-1.5 right-1 w-3.5 h-3.5 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-200" />
          </div>

          {/* Head */}
          <div className="relative w-11 h-10 rounded-full bg-white border-2 border-amber-200 flex flex-col items-center justify-center shadow-inner">
            {/* Eyes */}
            <div className="flex justify-between w-5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
            {/* Rosy Cheeks */}
            <div className="flex justify-between w-8 -mt-0.5">
              <div className="w-2 h-1 rounded-full bg-rose-300" />
              <div className="w-2 h-1 rounded-full bg-rose-300" />
            </div>
            {/* Snout */}
            <div className="w-3.5 h-2.5 rounded-full bg-rose-100 border border-amber-200 flex items-center justify-center -mt-0.5">
              <div className="w-1.5 h-1 rounded-full bg-rose-900" />
            </div>
          </div>

          {/* Body */}
          <div className="relative w-9 h-7 -mt-1.5 rounded-t-lg rounded-b-2xl bg-white border-2 border-amber-200 flex items-center justify-center">
            {/* Holds mini empanada */}
            <span className="text-xs">🥟</span>
          </div>

          {/* Feet */}
          <div className="flex justify-between w-8 -mt-1">
            <div className="w-3 h-2 rounded-full bg-amber-100 border border-amber-200" />
            <div className="w-3 h-2 rounded-full bg-amber-100 border border-amber-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
