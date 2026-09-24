import React from 'react';
import { Heart, Sparkles, Camera } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadHeartMosaicProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
}

export const SpreadHeartMosaic: React.FC<SpreadHeartMosaicProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
}) => {
  const mosaicPhotos = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: MOSAICO CORAZÓN ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 07 • MOSAICO DE RECUERDOS
            </span>
          </div>
          <span className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1">
            <Heart className="w-3 h-3 fill-rose-500" /> Corazón
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-auto">
          {mosaicPhotos.map((src, i) => (
            <div
              key={i}
              className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-md border-2 border-white hover:scale-105 transition cursor-pointer"
              onClick={onTriggerRain}
            >
              <img src={src} alt={`Mosaic ${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Cada pedacito es tuyo</span>
          <span className="font-mono text-[10px]">Página 07 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: MENSAJE ETERNO ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 08 • ETERNO AMOR
            </span>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Promesa
          </span>
        </div>

        <div className="my-auto space-y-4">
          <div className="bg-[#fffcf7] p-6 rounded-2xl shadow-lg border-2 border-rose-200">
            <h3 className="font-fancy text-3xl font-bold text-rose-950 mb-3 text-center">
              Para Siempre Marcelololelo
            </h3>
            <p className="font-hand text-xl text-slate-800 leading-relaxed text-center">
              "No existen suficientes palabras ni páginas en todo el universo para describir lo inmensamente feliz que me haces cada día. Prometo quererte, cuidarte y prepararte empanadas siempre."
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onTriggerRain}
              className="crystal-btn px-6 py-2.5 text-xs font-bold text-sky-950 rounded-full flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Presionar para Sorpresa
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Infinito como las estrellas</span>
          <span className="font-mono text-[10px]">Página 08 / 500</span>
        </div>
      </div>
    </div>
  );
};
