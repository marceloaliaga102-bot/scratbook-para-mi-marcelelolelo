import React from 'react';
import { Heart, Sparkles, Mail, BookOpen, Star, Camera } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadCoverProps {
  data: ScrapbookStore;
  onOpenLetter: () => void;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadCover: React.FC<SpreadCoverProps> = ({
  data,
  onOpenLetter,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PORTADA DE COLECCIÓN ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 md:p-10 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Top ribbon washi */}
        <div className="flex items-center justify-between">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-2 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 01 • PORTADA OFICIAL
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
        </div>

        {/* Center Cover Emblem */}
        <div className="my-auto text-center space-y-6">
          {/* Bear & Stars Illustration Circle */}
          <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-gradient-to-tr from-sky-300 via-rose-200 to-amber-200 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white overflow-hidden p-1 shadow-inner relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWpNdSVuq0o2aqmGVipejmexaZ2mzZQLDDGcx3TstkTJ15fIkH-mKV1mnzMueFoVwX2mWpDEU2s4mMg2ITcwEIQlyNTE8CZW4R5PbvNIlcqbjMHbP3hheC3zLB5WEIWL0cWb5BgtrTqQsgHvrTQm9MHKBaSsGZr891UYX5qcbUTpgoUakfSRHkJaKQCGqz_iWkGMtpzsIAAcnZY0xCtSE3rU05ExonrqbZ6rUQV1IoZwRCYoU8aZ5G0fh-AgAlbpZBoA"
                alt="Ositos enamorados"
                className="w-full h-full object-cover rounded-full animate-bears"
              />
              <button
                onClick={onTriggerRain}
                className="absolute inset-0 bg-sky-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition rounded-full"
              >
                🥟 ¡Lluvia de Empanadas!
              </button>
            </div>
            {/* Stamp on corner */}
            <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow border-2 border-white">
              500 Págs
            </div>
          </div>

          <div>
            <h1
              onClick={() =>
                onOpenEdit('Editar Título de Portada', data.coverTitle, 'text', (val) =>
                  onUpdateData({ coverTitle: val })
                )
              }
              className="font-fancy text-3xl sm:text-4xl md:text-5xl text-rose-950 font-bold tracking-wide cursor-pointer hover:text-rose-700 transition"
              title="Clic para editar título"
            >
              {data.coverTitle}
            </h1>
            <p
              onClick={() =>
                onOpenEdit('Editar Subtítulo', data.coverSubtitle, 'text', (val) =>
                  onUpdateData({ coverSubtitle: val })
                )
              }
              className="font-hand text-xl sm:text-2xl text-rose-800 mt-2 cursor-pointer hover:text-rose-900"
              title="Clic para editar subtítulo"
            >
              {data.coverSubtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 shadow-sm text-xs font-bold text-rose-700">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Para Mi Osito {data.recipientName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Creado con amor incondicional</span>
          <span className="font-mono text-[10px]">Tomo I / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: CARTA ÍNTIMA DESPLEGABLE ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 md:p-10 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Top ribbon washi */}
        <div className="flex items-center justify-between">
          <div className="washi-tape-pink px-4 py-1.5 rotate-2 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 02 • CARTA ÍNTIMA
            </span>
          </div>
          <div className="px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-bold border border-rose-300">
            De Mi Corazón
          </div>
        </div>

        {/* Envelope & Letter Preview Card */}
        <div className="my-auto space-y-4">
          <div className="bg-[#fffbf2] p-6 rounded-2xl shadow-xl border-2 border-amber-200/90 relative">
            {/* Wax seal graphic */}
            <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-rose-600 border-2 border-rose-300 shadow-lg flex items-center justify-center text-white">
              <Heart className="w-5 h-5 fill-white" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-rose-600" />
              <h3 className="font-fancy text-2xl font-bold text-rose-950">
                Para Mi Osito {data.recipientName}
              </h3>
            </div>

            <p className="font-hand text-xl text-slate-800 leading-relaxed mb-4 line-clamp-4">
              "{data.secretLetter}"
            </p>

            <div className="pt-3 border-t border-amber-200 flex items-center justify-between">
              <button
                onClick={onOpenLetter}
                className="crystal-btn px-4 py-2 text-xs font-bold text-sky-950 rounded-xl flex items-center gap-2 shadow"
              >
                <BookOpen className="w-4 h-4" />
                Abrir Carta Completa & Editar
              </button>

              <span className="font-hand text-lg text-rose-800 font-bold">
                Con amor, {data.senderName}
              </span>
            </div>
          </div>

          {/* Golden quote sticker */}
          <div className="bg-amber-100/90 p-4 rounded-xl border border-amber-300 shadow-sm text-center">
            <p className="font-fancy text-base text-amber-950 italic">
              "Cada latido de mi corazón lleva tu nombre grabado con ternura."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Palabras desde lo más profundo</span>
          <span className="font-mono text-[10px]">Página 02 / 500</span>
        </div>
      </div>
    </div>
  );
};
