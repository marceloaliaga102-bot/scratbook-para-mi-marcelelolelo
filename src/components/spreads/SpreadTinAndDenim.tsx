import React from 'react';
import { Sparkles, Camera, Plus, Edit2, Heart, CheckCircle2 } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadTinAndDenimProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadTinAndDenim: React.FC<SpreadTinAndDenimProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PÁG 17 - CAJITA METÁLICA DE TESOROS ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 17 • CAJITA DE RECUERDOS & TESOROS
            </span>
          </div>
          <span className="font-hand text-base text-sky-800 font-bold">Para {data.recipientName}</span>
        </div>

        {/* Metallic Tin Container */}
        <div className="metallic-tin rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-300 relative my-auto">
          {/* Tin Box Lid Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-300/80 mb-3 text-slate-700">
            <div className="flex items-center gap-2">
              {/* Whale airmail stamp */}
              <div className="bg-sky-50 border-2 border-dashed border-sky-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-sky-900 shadow-sm flex items-center gap-1">
                <span>🐋</span>
                <span>AIR MAIL • 50¢</span>
              </div>
              <div className="text-amber-500 text-xs">★ ★ ★</div>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-slate-200/90 text-slate-800 text-[10px] font-bold tracking-wider uppercase border border-slate-300 shadow-inner">
              SWEET #17
            </div>
          </div>

          <p className="font-hand text-lg text-slate-800 font-bold mb-3 italic">
            "Guardando cada instante contigo..."
          </p>

          {/* Inner Tin Tray (Blue Gingham Fabric Liner) */}
          <div className="metallic-inner rounded-2xl p-4 shadow-inner">
            <div className="blue-gingham rounded-xl p-3 sm:p-4 shadow border border-sky-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Polaroid 1 */}
                <div className="bg-white p-2 pb-3 rounded-lg shadow-md rotate-[-2deg] border border-slate-200 group">
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden mb-2 relative">
                    <img
                      src={data.tinPolaroid1}
                      alt="Polaroid 1"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <button
                      onClick={() =>
                        onOpenEdit('Cambiar Foto de Polaroid 1', data.tinPolaroid1, 'image', (val) =>
                          onUpdateData({ tinPolaroid1: val })
                        )
                      }
                      className="absolute inset-0 bg-sky-950/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      Cambiar
                    </button>
                  </div>
                  <div
                    onClick={() =>
                      onOpenEdit('Editar Título Polaroid 1', data.tinPolaroid1Title, 'text', (val) =>
                        onUpdateData({ tinPolaroid1Title: val })
                      )
                    }
                    className="text-center font-hand text-sm font-bold text-slate-800 cursor-pointer hover:text-sky-600"
                  >
                    {data.tinPolaroid1Title}
                  </div>
                </div>

                {/* Polaroid 2 */}
                <div className="bg-white p-2 pb-3 rounded-lg shadow-md rotate-[2deg] border border-slate-200 group">
                  <div className="aspect-square bg-slate-100 rounded overflow-hidden mb-2 relative">
                    <img
                      src={data.tinPolaroid2}
                      alt="Polaroid 2"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <button
                      onClick={() =>
                        onOpenEdit('Cambiar Foto de Polaroid 2', data.tinPolaroid2, 'image', (val) =>
                          onUpdateData({ tinPolaroid2: val })
                        )
                      }
                      className="absolute inset-0 bg-sky-950/60 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      Cambiar
                    </button>
                  </div>
                  <div
                    onClick={() =>
                      onOpenEdit('Editar Título Polaroid 2', data.tinPolaroid2Title, 'text', (val) =>
                        onUpdateData({ tinPolaroid2Title: val })
                      )
                    }
                    className="text-center font-hand text-sm font-bold text-slate-800 cursor-pointer hover:text-sky-600"
                  >
                    {data.tinPolaroid2Title}
                  </div>
                </div>
              </div>

              {/* Wish list note */}
              <div className="bg-[#fcfbf7] p-2.5 rounded-lg border border-amber-200 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider font-mono">
                    LISTA DE DESEOS:
                  </span>
                  <button
                    onClick={() => {
                      const newWish = prompt('Escribe un nuevo deseo juntos:');
                      if (newWish) {
                        onUpdateData({ tinWishList: [...data.tinWishList, newWish] });
                      }
                    }}
                    className="text-[10px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Añadir
                  </button>
                </div>
                <ul className="space-y-1 text-xs font-hand text-slate-800 font-semibold">
                  {data.tinWishList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={onTriggerRain}
              className="crystal-btn text-[11px] font-bold text-sky-950 px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Lluvia de Empanadas
            </button>
            <span className="text-[10px] font-mono text-slate-500">Colección #500</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center font-hand text-sm text-slate-500">
          ✦ Recuerdos atesorados por siempre en nuestra historia ✦
        </div>
      </div>

      {/* ================= RIGHT PAGE: PÁG 18 - BOLSILLO DENIM & PHOTOBOOTHS ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 18 • BOLSILLO DENIM & PHOTOBOOTHS
            </span>
          </div>
          <div className="px-3 py-0.5 bg-blue-100 border border-blue-300 rounded-full text-blue-900 text-xs font-bold">
            Jeans Edition
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start my-auto">
          {/* Denim Jean Pocket */}
          <div className="denim-pattern jeans-stitching rounded-b-3xl rounded-t-lg p-4 pt-6 shadow-2xl relative min-h-[380px] flex flex-col justify-between overflow-hidden">
            {/* Copper Rivets */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-700 to-amber-400 border border-amber-900 shadow" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-700 to-amber-400 border border-amber-900 shadow" />

            {/* Content sticking out of the pocket */}
            <div className="space-y-2 -mt-10 mb-4">
              {/* Photobooth strip */}
              <div className="bg-white p-2 rounded-lg shadow-xl border border-slate-300 rotate-[-3deg] hover:rotate-0 transition duration-300 group">
                <div className="w-full h-24 bg-slate-100 rounded overflow-hidden mb-1 relative">
                  <img
                    src={data.denimPocketPhoto}
                    alt="Pocket photobooth"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() =>
                      onOpenEdit('Cambiar Foto de Bolsillo', data.denimPocketPhoto, 'image', (val) =>
                        onUpdateData({ denimPocketPhoto: val })
                      )
                    }
                    className="absolute inset-0 bg-blue-950/70 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    Cambiar
                  </button>
                </div>
                <div className="text-center font-hand text-xs font-bold text-slate-800">
                  PHOTOBOOTH • {data.recipientName} & YO
                </div>
              </div>

              {/* Love debit card */}
              <div className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg text-white text-[10px] rotate-[2deg]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold tracking-wider font-mono">LOVE CARD DEBIT</span>
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="font-mono text-xs tracking-widest my-1">•••• 5200 1314</div>
                <div className="flex justify-between items-center text-[8px] font-sans">
                  <span>EXP: FOREVER</span>
                  <span className="font-bold">{data.recipientName.toUpperCase()}</span>
                </div>
              </div>

              {/* $20 Amor Eternal ticket */}
              <div className="bg-emerald-100 border border-emerald-400 px-3 py-1.5 rounded text-emerald-900 font-mono text-[9px] font-bold flex justify-between items-center shadow rotate-[-1deg]">
                <span>VALE POR: 100 ABRAZOS</span>
                <span className="bg-emerald-700 text-white px-1.5 py-0.5 rounded text-[8px]">VÁLIDO HOY</span>
              </div>
            </div>

            {/* Patch on pocket */}
            <div className="bg-amber-100 border-2 border-dashed border-amber-500 rounded-lg p-2 text-center shadow-inner mt-auto">
              <span className="font-sans-ui font-extrabold text-[11px] text-amber-950 tracking-wider">
                CALL ME IF YOU GET LOST
              </span>
            </div>
          </div>

          {/* Right column: 2 landscape cloud picture frames */}
          <div className="space-y-4">
            {/* Landscape 1 */}
            <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200 group">
              <div className="aspect-[16/10] vector-landscape-sky rounded-lg overflow-hidden relative mb-2">
                <img
                  src={data.denimLandscape1}
                  alt="Landscape 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <button
                  onClick={() =>
                    onOpenEdit('Cambiar Foto de Paisaje 1', data.denimLandscape1, 'image', (val) =>
                      onUpdateData({ denimLandscape1: val })
                    )
                  }
                  className="absolute inset-0 bg-sky-950/60 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>
              <div
                onClick={() =>
                  onOpenEdit('Editar Título Paisaje 1', data.denimLandscape1Title, 'text', (val) =>
                    onUpdateData({ denimLandscape1Title: val })
                  )
                }
                className="text-xs font-bold text-slate-800 hover:text-sky-600 cursor-pointer text-center"
              >
                {data.denimLandscape1Title}
              </div>
            </div>

            {/* Landscape 2 */}
            <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200 group">
              <div className="aspect-[16/10] vector-landscape-sky rounded-lg overflow-hidden relative mb-2">
                <img
                  src={data.denimLandscape2}
                  alt="Landscape 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <button
                  onClick={() =>
                    onOpenEdit('Cambiar Foto de Paisaje 2', data.denimLandscape2, 'image', (val) =>
                      onUpdateData({ denimLandscape2: val })
                    )
                  }
                  className="absolute inset-0 bg-sky-950/60 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>
              <div
                onClick={() =>
                  onOpenEdit('Editar Título Paisaje 2', data.denimLandscape2Title, 'text', (val) =>
                    onUpdateData({ denimLandscape2Title: val })
                  )
                }
                className="text-xs font-bold text-slate-800 hover:text-sky-600 cursor-pointer text-center"
              >
                {data.denimLandscape2Title}
              </div>
            </div>
          </div>
        </div>

        {/* Handcrafted footer badge */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-blue-700">♥ Hecho a mano con todo mi cariño</span>
          <span className="font-mono text-[10px]">Página 18 / 500</span>
        </div>
      </div>
    </div>
  );
};
