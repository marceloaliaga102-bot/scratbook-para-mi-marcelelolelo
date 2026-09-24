import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, Camera, Edit2, Sparkles, CheckCircle2, Repeat, Share2 } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadSocialFeedProps {
  data: ScrapbookStore;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadSocialFeed: React.FC<SpreadSocialFeedProps> = ({
  data,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  const toggleIgLike = () => {
    const newLiked = !data.isIgLiked;
    const newCount = newLiked ? data.igLikesCount + 1 : data.igLikesCount - 1;
    onUpdateData({ isIgLiked: newLiked, igLikesCount: newCount });
    if (newLiked) onTriggerRain();
  };

  const toggleXLike = () => {
    const newLiked = !data.isXLiked;
    onUpdateData({ isXLiked: newLiked });
    if (newLiked) onTriggerRain();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: PÁGINA 09 • NUESTRO FEED ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Top washi header */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 09 • NUESTRO FEED
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-300/60 rounded-full text-pink-700 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram Memory</span>
          </div>
        </div>

        {/* Instagram Post Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col my-auto transition hover:shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=100&auto=format&fit=crop"
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-800">{data.recipientName.toLowerCase()}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Bajo las estrellas • Nuestro rincón</span>
              </div>
            </div>
            <span className="text-slate-400 text-xs font-bold tracking-widest cursor-pointer hover:text-slate-600">•••</span>
          </div>

          {/* Photo & Floating speech bubble */}
          <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden group">
            <img
              src={data.igPhoto}
              alt="Feed post"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Floating speech bubble */}
            <div
              onClick={() =>
                onOpenEdit('Editar Mensaje Flotante', data.igBubbleText, 'text', (val) =>
                  onUpdateData({ igBubbleText: val })
                )
              }
              className="absolute top-4 left-4 bg-black/65 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-white/20 cursor-pointer hover:bg-black/80 transition"
              title="Clic para editar mensaje flotante"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-hand text-sm font-semibold">{data.igBubbleText}</span>
              <Edit2 className="w-3 h-3 text-white/70" />
            </div>

            {/* Tag badge */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow border border-white">
              ✨ Inolvidable
            </div>
          </div>

          {/* Action buttons & Likes */}
          <div className="p-4 space-y-2.5 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleIgLike}
                  className="transition transform active:scale-125 focus:outline-none"
                >
                  <Heart
                    className={`w-6 h-6 transition ${
                      data.isIgLiked
                        ? 'fill-rose-500 text-rose-500 scale-110'
                        : 'text-slate-700 hover:text-rose-500'
                    }`}
                  />
                </button>
                <button
                  onClick={onTriggerRain}
                  className="text-slate-700 hover:text-sky-500 transition"
                  title="Comentar"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button
                  onClick={onTriggerRain}
                  className="text-slate-700 hover:text-sky-500 transition"
                  title="Compartir amor"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <Bookmark className="w-6 h-6 text-slate-700 hover:text-amber-500 transition cursor-pointer" />
            </div>

            {/* Likes count */}
            <div className="text-xs font-bold text-slate-900 cursor-pointer hover:text-rose-600 transition" onClick={toggleIgLike}>
              {data.igLikesCount.toLocaleString()} Me Gusta
            </div>

            {/* Caption */}
            <div className="text-xs text-slate-800 leading-relaxed">
              <span className="font-bold mr-1.5">{data.recipientName.toLowerCase()}</span>
              <span>{data.igCaption}</span>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              HACE 2 HORAS • ESPECIAL 500 PÁGINAS
            </div>

            {/* Edit actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Instagram', data.igPhoto, 'image', (val) =>
                    onUpdateData({ igPhoto: val })
                  )
                }
                className="crystal-btn text-[11px] font-bold text-sky-950 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                + Cambiar Foto
              </button>
              <button
                onClick={() =>
                  onOpenEdit('Editar Pie de Foto', data.igCaption, 'textarea', (val) =>
                    onUpdateData({ igCaption: val })
                  )
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Editar Pie de Foto
              </button>
            </div>
          </div>
        </div>

        {/* Bottom decorative note */}
        <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Guardado en nuestro diario de 500 págs</span>
          <span className="font-mono text-[10px]">#Marcelololelo</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PÁGINA 10 • NUESTROS TWEETS ================= */}
      <div className="bg-paper-texture p-4 sm:p-6 md:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Top washi header */}
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded-sm shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 10 • NUESTROS TWEETS
            </span>
          </div>
          <div className="px-3 py-1 bg-sky-100 border border-sky-300 rounded-full text-sky-800 text-xs font-bold">
            #EternoAmor
          </div>
        </div>

        {/* Twitter / X Post Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/90 mb-4 transition hover:shadow-xl">
          {/* Tweet author header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=100&auto=format&fit=crop"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">copegenz.nt</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                </div>
                <div className="text-[11px] text-slate-400">@copegenz • Tu Osito</div>
              </div>
            </div>
            <button
              onClick={() =>
                onOpenEdit('Editar Cita Superior', data.xTopQuote, 'text', (val) =>
                  onUpdateData({ xTopQuote: val })
                )
              }
              className="text-slate-400 hover:text-sky-600 transition"
              title="Editar cita"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tweet quote & body */}
          <p className="font-fancy text-base text-sky-900 font-bold mb-2 leading-relaxed">
            {data.xTopQuote}
          </p>
          <p
            onClick={() =>
              onOpenEdit('Editar Contenido del Tweet', data.xBody, 'textarea', (val) =>
                onUpdateData({ xBody: val })
              )
            }
            className="text-xs text-slate-700 leading-relaxed mb-3 cursor-pointer hover:bg-sky-50/50 p-1.5 rounded transition"
            title="Clic para editar texto del tweet"
          >
            {data.xBody}
          </p>

          {/* Tweet two preview photos */}
          <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden mb-3 border border-slate-200">
            <div className="relative aspect-video group overflow-hidden bg-slate-100">
              <img src={data.xPhoto1} alt="Tweet Pic 1" className="w-full h-full object-cover" />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto 1 del Tweet', data.xPhoto1, 'image', (val) =>
                    onUpdateData({ xPhoto1: val })
                  )
                }
                className="absolute inset-0 bg-black/50 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar
              </button>
            </div>
            <div className="relative aspect-video group overflow-hidden bg-slate-100">
              <img src={data.xPhoto2} alt="Tweet Pic 2" className="w-full h-full object-cover" />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto 2 del Tweet', data.xPhoto2, 'image', (val) =>
                    onUpdateData({ xPhoto2: val })
                  )
                }
                className="absolute inset-0 bg-black/50 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Tweet stats */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 hover:text-sky-600 cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              <span>8.4K</span>
            </div>
            <div className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer">
              <Repeat className="w-4 h-4" />
              <span>24.1K</span>
            </div>
            <button
              onClick={toggleXLike}
              className={`flex items-center gap-1 transition ${
                data.isXLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${data.isXLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{data.xLikesCount}</span>
            </button>
            <Share2 className="w-4 h-4 hover:text-sky-600 cursor-pointer" />
          </div>
        </div>

        {/* DigiCam 2000s & Sticky Note Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          {/* DigiCam */}
          <div className="bg-sky-200/80 p-3 rounded-2xl border-2 border-sky-300 shadow-md relative">
            <div className="flex items-center justify-between text-[9px] font-mono text-sky-900 mb-1 font-bold">
              <span className="flex items-center gap-1 text-rose-600 animate-pulse">● REC</span>
              <span>00:14:28</span>
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-sky-400 bg-slate-900 relative group">
              <img src={data.cameraPhoto} alt="Digicam" className="w-full h-full object-cover" />
              <button
                onClick={() =>
                  onOpenEdit('Cambiar Foto de Cámara DigiCam', data.cameraPhoto, 'image', (val) =>
                    onUpdateData({ cameraPhoto: val })
                  )
                }
                className="absolute inset-0 bg-sky-950/60 text-white text-[11px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                Editar Toma
              </button>
            </div>
            <div className="text-center mt-1.5 font-mono text-[9px] text-sky-900 font-bold tracking-widest">
              DIGICAM • 2000S
            </div>
          </div>

          {/* Sticky note */}
          <div className="bg-amber-100 p-4 rounded-xl shadow-md border-l-4 border-amber-400 rotate-1 relative">
            <div className="w-3 h-3 rounded-full bg-rose-500 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow" />
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              CITA EN PEGATINA
            </div>
            <p className="font-hand text-lg text-amber-950 font-bold leading-tight">
              {data.stickyQuote}
            </p>
            <button
              onClick={() =>
                onOpenEdit('Editar Cita de Pegatina', data.stickyQuote, 'text', (val) =>
                  onUpdateData({ stickyQuote: val })
                )
              }
              className="mt-2 text-[10px] text-amber-800 hover:text-amber-950 font-semibold underline block"
            >
              Modificar Frase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
