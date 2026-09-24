import React from 'react';
import { Camera, Heart, Sparkles, Plus, Edit2, Calendar } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadSpecialMomentsProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadSpecialMoments: React.FC<SpreadSpecialMomentsProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: NUESTRA HISTORIA ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 03 • NUESTROS PRIMEROS PASOS
            </span>
          </div>
          <span className="text-xs font-bold text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
            Capítulo 1
          </span>
        </div>

        <div className="space-y-4 my-auto">
          <div className="bg-white p-3.5 rounded-2xl shadow-md border border-slate-200">
            <h3 className="font-fancy text-2xl font-bold text-rose-950 mb-2">
              El Día en que Todo Cambió
            </h3>
            <p className="font-hand text-lg text-slate-800 leading-relaxed">
              Desde aquella primera conversación hasta convertirnos en inseparables, cada segundo a tu lado me demostró que el amor de verdad existe, es dulce y reconfortante como un abrazo tuyo.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 group">
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative mb-2">
              <img
                src={data.specialMoments[0]?.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop'}
                alt="Momento 1"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Momento', data.specialMoments[0]?.photo || '', 'image', (val) => {
                    const updated = [...data.specialMoments];
                    updated[0] = { ...updated[0], photo: val };
                    onUpdateData({ specialMoments: updated });
                  })
                }
                className="absolute inset-0 bg-sky-950/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar Foto
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="font-hand text-base">{data.specialMoments[0]?.title || 'El inicio de nuestra magia'}</span>
              <span className="text-[10px] text-slate-500 font-mono">{data.specialMoments[0]?.date || 'Día Inolvidable'}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-sky-700">♥ Donde comenzó nuestro viaje</span>
          <span className="font-mono text-[10px]">Página 03 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: GALERÍA POLAROIDS ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 04 • MOMENTOS POLAROID
            </span>
          </div>
          <span className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            Galería
          </span>
        </div>

        <div className="space-y-4 my-auto">
          <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 group">
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative mb-2">
              <img
                src={data.specialMoments[1]?.photo || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop'}
                alt="Momento 2"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Momento', data.specialMoments[1]?.photo || '', 'image', (val) => {
                    const updated = [...data.specialMoments];
                    updated[1] = { ...updated[1], photo: val };
                    onUpdateData({ specialMoments: updated });
                  })
                }
                className="absolute inset-0 bg-sky-950/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar Foto
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="font-hand text-base">{data.specialMoments[1]?.title || 'Tardes de risas infinitas'}</span>
              <span className="text-[10px] text-slate-500 font-mono">{data.specialMoments[1]?.date || 'Siempre Juntos'}</span>
            </div>
          </div>

          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
            <p className="font-fancy text-lg text-rose-950 italic">
              "No importa qué estemos haciendo, si es contigo se convierte en mi momento favorito del día."
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Recuerdos que no se borran jamás</span>
          <span className="font-mono text-[10px]">Página 04 / 500</span>
        </div>
      </div>
    </div>
  );
};
