import React from 'react';
import { Tv, Film, Plus, Edit2, Heart, Sparkles, Pin } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadThingsWeLoveProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadThingsWeLove: React.FC<SpreadThingsWeLoveProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PÁG 21 - THINGS WE LOVE ================= */}
      <div className="bg-[#1e293b] p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-700 min-h-[720px] text-white">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 21 • THINGS WE LOVE / COSAS QUE AMAMOS
            </span>
          </div>
          <button
            onClick={() => {
              const newTitle = prompt('¿Qué otra cosa te encanta de ambos?');
              if (newTitle) {
                onUpdateData({
                  thingsWeLovePhotos: [
                    ...data.thingsWeLovePhotos,
                    {
                      id: 'twl-' + Date.now(),
                      title: newTitle,
                      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
                    },
                  ],
                });
              }
            }}
            className="crystal-btn text-[11px] font-bold text-sky-950 px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> + Añadir
          </button>
        </div>

        {/* 4 Pinned Polaroids Grid */}
        <div className="grid grid-cols-2 gap-3.5 my-auto">
          {data.thingsWeLovePhotos.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-white text-slate-800 p-2.5 pb-3 rounded-xl shadow-lg border border-slate-200 relative group transition hover:scale-105 ${
                idx % 2 === 0 ? '-rotate-2' : 'rotate-2'
              }`}
            >
              {/* Pushpin at top */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-rose-500 shadow-md border-2 border-white" />
              </div>

              {item.stamp && (
                <div className="absolute top-2 right-2 bg-amber-100 border border-amber-400 text-amber-900 text-[8px] font-mono px-1 rounded z-10">
                  {item.stamp}
                </div>
              )}

              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <button
                  onClick={() =>
                    onOpenEdit(`Cambiar Foto: ${item.title}`, item.url, 'image', (val) => {
                      const updated = [...data.thingsWeLovePhotos];
                      updated[idx].url = val;
                      onUpdateData({ thingsWeLovePhotos: updated });
                    })
                  }
                  className="absolute inset-0 bg-sky-950/70 text-white text-[11px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>

              <div
                onClick={() => {
                  const newT = prompt('Editar título:', item.title);
                  if (newT) {
                    const updated = [...data.thingsWeLovePhotos];
                    updated[idx].title = newT;
                    onUpdateData({ thingsWeLovePhotos: updated });
                  }
                }}
                className="text-center font-hand text-base font-bold text-slate-900 cursor-pointer hover:text-sky-600 truncate"
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span className="font-hand text-base text-amber-400">♥ Cosas que hacen única nuestra vida</span>
          <span className="font-mono text-[10px]">Página 21 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PÁG 22 - RETRO MEMORIES & FILM ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 22 • RETRO MEMORIES & FILM
            </span>
          </div>
          <div className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-bold">
            Cinema Nostalgia
          </div>
        </div>

        <div className="space-y-4 my-auto">
          {/* Retro CRT Television */}
          <div className="bg-gradient-to-b from-amber-950 to-amber-900 p-4 rounded-3xl shadow-2xl border-4 border-amber-800 text-amber-100 relative">
            <div className="flex items-center justify-between text-[10px] font-mono mb-2 text-amber-200">
              <span className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5" /> CANAL 04 • NUESTRA HISTORIA
              </span>
              <span>VOL 100%</span>
            </div>

            <div className="aspect-[4/3] bg-black rounded-2xl overflow-hidden border-4 border-amber-700/60 shadow-inner relative group">
              <img
                src={data.retroTvPhoto}
                alt="Retro TV Memory"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Pantalla de TV', data.retroTvPhoto, 'image', (val) =>
                    onUpdateData({ retroTvPhoto: val })
                  )
                }
                className="absolute inset-0 bg-black/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar Foto de Pantalla
              </button>
            </div>

            {/* Knobs */}
            <div className="flex items-center justify-around mt-3 pt-2 border-t border-amber-800">
              <div className="w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-600 shadow flex items-center justify-center text-[8px] font-mono">
                CH
              </div>
              <div className="w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-600 shadow flex items-center justify-center text-[8px] font-mono">
                VOL
              </div>
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow" />
            </div>
          </div>

          {/* Film Clapperboard */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xl border-2 border-slate-700">
            {/* Clapper stripes */}
            <div className="h-6 bg-repeating-linear-gradient-to-r from-white via-white to-black opacity-80 rounded mb-3" />

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-b border-slate-800 pb-2 mb-2">
              <div>
                <span className="text-slate-400 block">SCENE</span>
                <span className="font-bold text-amber-400">{data.clapperboardData.scene}</span>
              </div>
              <div>
                <span className="text-slate-400 block">TAKE</span>
                <span className="font-bold text-emerald-400">{data.clapperboardData.take}</span>
              </div>
              <div>
                <span className="text-slate-400 block">DIRECTOR</span>
                <span className="font-bold text-sky-400 truncate block">
                  {data.recipientName} & Amor
                </span>
              </div>
            </div>

            <p
              onClick={() =>
                onOpenEdit(
                  'Editar Frase de Película',
                  data.clapperboardData.quote,
                  'text',
                  (val) =>
                    onUpdateData({
                      clapperboardData: { ...data.clapperboardData, quote: val },
                    })
                )
              }
              className="text-xs font-fancy text-amber-200 italic cursor-pointer hover:bg-slate-800 p-1 rounded"
            >
              {data.clapperboardData.quote}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Una película que nunca terminará</span>
          <span className="font-mono text-[10px]">Página 22 / 500</span>
        </div>
      </div>
    </div>
  );
};
