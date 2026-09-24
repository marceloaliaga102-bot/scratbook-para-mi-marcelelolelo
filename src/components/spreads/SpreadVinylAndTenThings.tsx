import React from 'react';
import { Disc, Music, Camera, Heart, Check, Play, Pause, Edit2, Plus, Sparkles } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadVinylAndTenThingsProps {
  data: ScrapbookStore;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadVinylAndTenThings: React.FC<SpreadVinylAndTenThingsProps> = ({
  data,
  isPlayingMusic,
  onToggleMusic,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PÁG 23 - SIDE A • NUESTRA MÚSICA ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 23 • SIDE A • NUESTRA MÚSICA
            </span>
          </div>
          <button
            onClick={onToggleMusic}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-full text-sky-900 text-xs font-bold transition shadow-sm"
          >
            {isPlayingMusic ? (
              <>
                <Pause className="w-3.5 h-3.5 text-rose-500" /> Pausar Música
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Reproducir Vinilo
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 my-auto">
          {/* Vinyl Record & Sleeve Container */}
          <div className="flex items-center justify-center gap-4 relative py-2">
            {/* Spinning Vinyl Record */}
            <div
              onClick={onToggleMusic}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full vinyl-grooves p-3 shadow-2xl relative cursor-pointer border-2 border-slate-800 ${
                isPlayingMusic ? 'spin-record' : 'spin-record spin-paused'
              }`}
              title="Clic para reproducir / pausar"
            >
              {/* Center Vinyl Label */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 mx-auto my-auto absolute inset-0 m-auto flex flex-col items-center justify-center text-white shadow-inner border-4 border-slate-900 text-center">
                <Disc className="w-4 h-4 mb-0.5" />
                <span className="text-[8px] font-bold font-mono uppercase tracking-widest leading-none">
                  SIDE A
                </span>
                <span className="text-[7px] font-sans font-semibold truncate max-w-[50px]">
                  {data.vinylTrackName}
                </span>
              </div>
            </div>

            {/* Polaroid note beside the vinyl */}
            <div className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 rotate-2 max-w-[170px] group">
              <div className="aspect-square rounded overflow-hidden mb-1 relative bg-slate-100">
                <img
                  src={data.polaroidMoonPhoto}
                  alt="Moon photo"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    onOpenEdit('Cambiar Foto de Noche Estrellada', data.polaroidMoonPhoto, 'image', (val) =>
                      onUpdateData({ polaroidMoonPhoto: val })
                    )
                  }
                  className="absolute inset-0 bg-sky-950/70 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>
              <div className="font-hand text-xs text-slate-800 font-bold text-center leading-tight">
                "Bajo la misma luna • Noche estrellada"
              </div>
            </div>
          </div>

          {/* Vintage Cassette Tape */}
          <div className="bg-slate-800 text-white rounded-xl p-3 border-2 border-slate-600 shadow-md">
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-1">
              <span>PLAYLIST BLACKWOOD C-60</span>
              <span>STEREO • HI-FI</span>
            </div>
            <div className="bg-slate-700/80 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-500 flex items-center justify-center text-[8px] font-mono">
                  A
                </div>
                <span className="font-hand text-base text-amber-200 font-semibold">
                  Canciones para bailar lento contigo ♡
                </span>
              </div>
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
          </div>

          {/* Photobooth trio memories */}
          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex items-center justify-around text-xs font-hand text-amber-950 font-bold">
            {data.photoboothItems.map((item, i) => (
              <span key={i} className="hover:text-rose-600 cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          <p className="font-fancy text-base text-sky-950 text-center italic">
            "No hay melodía más bonita que escuchar tu risa cuando te cuento tonterías."
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-sky-700">♥ SIDE A / Disco de Oro</span>
          <span className="font-mono text-[10px]">Página 23 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PÁG 24 - 10 THINGS I LOVE ABOUT YOU ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-3">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 24 • 10 THINGS I LOVE ABOUT YOU
            </span>
          </div>
          <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            Para {data.recipientName}
          </span>
        </div>

        {/* Clipboard with 10 things in Typewriter Font */}
        <div className="bg-[#fcfaf2] rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-amber-200/80 relative my-auto">
          {/* Metal clipboard clip graphic */}
          <div className="w-24 h-5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-b mx-auto -mt-6 sm:-mt-7 mb-3 shadow border border-slate-500" />

          <h3 className="font-typewriter text-xs font-bold text-slate-900 tracking-wider text-center uppercase mb-3 border-b border-amber-300 pb-2">
            10 COSAS QUE AMO DE TI
          </h3>

          <ol className="space-y-1.5 font-typewriter text-[11px] sm:text-xs text-slate-800 leading-snug">
            {data.tenThingsList.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  const newText = prompt(`Editar razón #${idx + 1}:`, item);
                  if (newText) {
                    const updated = [...data.tenThingsList];
                    updated[idx] = newText;
                    onUpdateData({ tenThingsList: updated });
                  }
                }}
                className="cursor-pointer hover:bg-amber-100/60 p-1 rounded transition flex items-start gap-1.5 group"
                title="Clic para editar esta razón"
              >
                <span className="font-bold text-rose-600 shrink-0">{idx + 1}.</span>
                <span className="group-hover:text-rose-950">{item}</span>
              </li>
            ))}
          </ol>

          {/* Wooden Clipboard Bottom Note */}
          <div className="mt-3 pt-2 border-t border-amber-300 bg-amber-50/70 p-2.5 rounded-lg text-[11px] text-slate-700 italic font-serif-romance">
            <p
              onClick={() =>
                onOpenEdit('Editar Cita del Portapapeles', data.clipboardQuote, 'textarea', (val) =>
                  onUpdateData({ clipboardQuote: val })
                )
              }
              className="cursor-pointer hover:text-rose-800"
            >
              {data.clipboardQuote}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">
            ★ De las 500 páginas, cada una tiene un motivo para quererte
          </span>
          <span className="font-mono text-[10px]">Página 24 / 500</span>
        </div>
      </div>
    </div>
  );
};
