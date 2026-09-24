import React from 'react';
import { Award, Camera, Sparkles, Plus, Edit2, Heart, CheckCircle2, Star } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadAchievementsProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadAchievements: React.FC<SpreadAchievementsProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PÁG 19 - YOUR ACHIEVEMENTS ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 19 • YOUR ACHIEVEMENTS / TUS LOGROS
            </span>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            ★ Orgullo Máximo
          </span>
        </div>

        <p className="font-hand text-lg text-slate-800 font-bold mb-4">
          "Mi razón de orgullo — Cada meta que cumples alegra mi vida entera."
        </p>

        {/* Photobooth achievements strip & Retro Phone Display */}
        <div className="space-y-4 my-auto">
          {/* Achievement cards */}
          <div className="grid grid-cols-3 gap-2">
            {data.achievements.map((ach, idx) => (
              <div
                key={ach.id}
                onClick={() => {
                  const newTitle = prompt('Editar nombre de logro:', ach.title);
                  if (newTitle) {
                    const updated = [...data.achievements];
                    updated[idx] = { ...updated[idx], title: newTitle };
                    onUpdateData({ achievements: updated });
                  }
                }}
                className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-md cursor-pointer transition hover:border-amber-400 group"
              >
                <div className="w-8 h-8 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  {ach.title}
                </div>
              </div>
            ))}
          </div>

          {/* Retro Phone / Music Screen Display */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border-4 border-slate-700 relative group overflow-hidden">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
              <span>TU GRAN PASO</span>
              <span>100% COMPLETADO</span>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 relative mb-3">
              <img
                src={data.achievementPhonePhoto}
                alt="Achievement Memory"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Logro', data.achievementPhonePhoto, 'image', (val) =>
                    onUpdateData({ achievementPhonePhoto: val })
                  )
                }
                className="absolute inset-0 bg-sky-950/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Subir Foto de Tu Logro
              </button>
            </div>

            <div
              onClick={() =>
                onOpenEdit('Editar Dedicatoria de Logro', data.achievementQuote, 'textarea', (val) =>
                  onUpdateData({ achievementQuote: val })
                )
              }
              className="text-xs text-sky-200 font-serif-romance italic leading-relaxed cursor-pointer hover:bg-white/10 p-1.5 rounded transition"
            >
              {data.achievementQuote}
            </div>

            <div className="text-right text-[10px] text-amber-400 font-mono mt-1">
              #Orgullo #SinLímites
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              const newAch = prompt('Añadir nuevo logro de tu osito:');
              if (newAch) {
                onUpdateData({
                  achievements: [
                    ...data.achievements,
                    { id: 'a-' + Date.now(), title: newAch, icon: 'star' },
                  ],
                });
              }
            }}
            className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> + Añadir Logro
          </button>
          <span className="font-mono text-[10px]">Página 19 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PÁG 20 - VINTAGE CAPTURED MOMENTS ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Header washi tape */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 20 • VINTAGE CAPTURED MOMENTS
            </span>
          </div>
          {/* Tardis police box blue sticker */}
          <div className="bg-blue-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow">
            POLICE PUBLIC CALL BOX
          </div>
        </div>

        <div className="space-y-4 my-auto">
          {/* Retro 35mm Camera view */}
          <div className="bg-gradient-to-b from-slate-200 to-slate-400 p-4 rounded-3xl shadow-xl border-4 border-slate-500 relative">
            <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1 text-red-600 font-bold">● LIVE 35MM</span>
              <span>SHUTTER: 1/125</span>
              <span>ISO 400</span>
            </div>

            <div className="aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-600 relative group">
              <img
                src={data.birthdayCameraPhoto}
                alt="Birthday Memory"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Cámara Vintage', data.birthdayCameraPhoto, 'image', (val) =>
                    onUpdateData({ birthdayCameraPhoto: val })
                  )
                }
                className="absolute inset-0 bg-slate-950/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar Toma
              </button>
            </div>
            <div className="text-center font-mono text-[9px] text-slate-700 mt-2 font-bold tracking-widest">
              VINTAGE SHUTTER EDITION
            </div>
          </div>

          {/* Birthday / Special dedication card */}
          <div className="bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-rose-200 relative">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="font-fancy text-xl font-bold text-rose-900">
                Dedicatoria Especial Para {data.recipientName}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-hand text-base">
              {data.birthdayNotes.map((note, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const newNote = prompt('Editar nota:', note);
                    if (newNote) {
                      const updated = [...data.birthdayNotes];
                      updated[idx] = newNote;
                      onUpdateData({ birthdayNotes: updated });
                    }
                  }}
                  className="cursor-pointer hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition"
                >
                  ✦ {note}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-rose-100 text-right font-hand text-sm text-rose-800 font-bold">
              CON TODO MI CARIÑO - Para Ti, Siempre ✦
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Recuerdos capturados en el tiempo</span>
          <span className="font-mono text-[10px]">Página 20 / 500</span>
        </div>
      </div>
    </div>
  );
};
