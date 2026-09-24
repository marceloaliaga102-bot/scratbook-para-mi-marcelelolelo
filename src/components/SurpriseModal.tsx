import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, X, Star, Flame } from 'lucide-react';
import { romanticAudio } from '../utils/audio';

interface SurpriseModalProps {
  surpriseQuotes?: string[];
  recipientName?: string;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  surpriseQuotes = [
    '¡Eres lo más lindo que me ha pasado en la vida! ❤️✨',
    'Vale por: 100 besitos seguidos, un abrazo apapachador y tus empanadas favoritas. 🥟💋',
    'Si me dieran un deseo, pediría estar a tu lado en todas las vidas posibles.',
    'Cada día que pasa me convenzo más de que tú y yo estábamos destinados a estar juntitos.',
    'Te amo con todo mi corazón, mi osito precioso. ¡Gracias por hacerme tan feliz!'
  ],
  recipientName = 'Mi Osito',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const triggerFlyingHearts = () => {
    // Sound chime
    romanticAudio.playSurpriseChime();

    // Canvas confetti flying hearts
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    // Heart shapes
    const heartScalar = 2;
    const heart = confetti.shapeFromPath({
      path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 76,-75 38,0 57,18 75,56z',
    });

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.75 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fde047', '#ffedd5'],
        shapes: [heart, 'circle'],
        scalar: heartScalar,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.75 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fde047', '#ffedd5'],
        shapes: [heart, 'circle'],
        scalar: heartScalar,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Random quote index
    const nextIdx = Math.floor(Math.random() * surpriseQuotes.length);
    setCurrentQuoteIndex(nextIdx);
    setIsOpen(true);
  };

  const handleNextSurprise = () => {
    romanticAudio.playSurpriseChime();
    confetti({
      particleCount: 40,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#ec4899', '#fbbf24'],
    });
    setCurrentQuoteIndex((prev) => (prev + 1) % surpriseQuotes.length);
  };

  return (
    <>
      {/* Floating Surprise Button with romantic glow */}
      <button
        onClick={triggerFlyingHearts}
        className="relative group px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold shadow-[0_0_25px_rgba(244,63,94,0.65)] hover:shadow-[0_0_35px_rgba(244,63,94,0.9)] transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-rose-200/50"
      >
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity animate-pulse" />
        <Gift className="relative w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-bounce" />
        <span className="relative text-xs sm:text-sm tracking-wide">
          ¡Botón de Sorpresa!
        </span>
        <Heart className="relative w-4 h-4 text-rose-200 fill-rose-300 animate-ping" />
      </button>

      {/* Surprise Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-rose-950/95 via-rose-900/90 to-amber-950/95 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/40 shadow-[0_20px_60px_rgba(244,63,94,0.5)] text-center text-white overflow-hidden transform animate-scale-up">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Surprise Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-lg shadow-rose-500/40 flex items-center justify-center mb-4">
              <div className="w-full h-full bg-rose-950 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-500 animate-pulse" />
              </div>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-bold text-amber-200 mb-2 drop-shadow"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              ¡Una Sorpresita Para Ti, {recipientName}!
            </h3>

            <div className="my-5 p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm shadow-inner relative">
              <Sparkles className="absolute top-2 left-2 w-4 h-4 text-amber-300/60" />
              <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-amber-300/60" />
              <p
                className="text-lg sm:text-xl text-rose-50 font-medium leading-relaxed"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                "{surpriseQuotes[currentQuoteIndex]}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
              <button
                onClick={handleNextSurprise}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-950" />
                <span>¡Otra Sorpresa!</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-rose-100 font-semibold text-sm transition-all"
              >
                Guardar en mi corazón ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
