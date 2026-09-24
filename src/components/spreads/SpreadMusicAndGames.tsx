import React from 'react';
import { Music, Gamepad2, Disc, Play, Pause, Heart, Sparkles } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';

interface SpreadMusicAndGamesProps {
  data: ScrapbookStore;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadMusicAndGames: React.FC<SpreadMusicAndGamesProps> = ({
  data,
  isPlayingMusic,
  onToggleMusic,
  onOpenEdit,
  onTriggerRain,
}) => {
  const songs = [
    { title: 'Yellow', artist: 'Coldplay', icon: '💛' },
    { title: "Can't Help Falling in Love", artist: 'Elvis Presley', icon: '💫' },
    { title: 'Perfect', artist: 'Ed Sheeran', icon: '✨' },
    { title: 'Until I Found You', artist: 'Stephen Sanchez', icon: '🌙' },
  ];

  const games = [
    { title: 'Minecraft', desc: 'Nuestra casita de madera y granja de flores 🏡' },
    { title: 'It Takes Two', desc: 'Superando cada nivel en equipo perfecto 🧩' },
    { title: 'Roblox / Party', desc: 'Risas sin parar cuando perdemos juntos 🎮' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: NUESTRAS CANCIONES ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 05 • NUESTRAS CANCIONES
            </span>
          </div>
          <button
            onClick={onToggleMusic}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-full text-sky-900 text-xs font-bold transition shadow-sm"
          >
            {isPlayingMusic ? (
              <>
                <Pause className="w-3.5 h-3.5 text-rose-500" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Reproducir
              </>
            )}
          </button>
        </div>

        <div className="space-y-4 my-auto">
          {/* Cassette Graphic */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border-4 border-slate-700">
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-2">
              <span>CASSETTE MIXTAPE • LADO A</span>
              <span>STEREO DOLBY</span>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-center gap-6 border border-slate-600">
              <div className={`w-14 h-14 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center ${isPlayingMusic ? 'animate-spin' : ''}`}>
                <div className="w-4 h-4 bg-slate-950 rounded-full" />
              </div>
              <div className="text-center">
                <div className="font-hand text-xl text-amber-300 font-bold">Para {data.recipientName}</div>
                <div className="text-[10px] text-slate-400 font-mono">Banda Sonora de Amor</div>
              </div>
              <div className={`w-14 h-14 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center ${isPlayingMusic ? 'animate-spin' : ''}`}>
                <div className="w-4 h-4 bg-slate-950 rounded-full" />
              </div>
            </div>
          </div>

          {/* Song list */}
          <div className="space-y-2">
            {songs.map((song, i) => (
              <div
                key={i}
                onClick={onToggleMusic}
                className="bg-white/80 hover:bg-white p-2.5 rounded-xl border border-sky-100 shadow-sm flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{song.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{song.title}</div>
                    <div className="text-[10px] text-slate-500">{song.artist}</div>
                  </div>
                </div>
                <Music className="w-4 h-4 text-sky-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-sky-700">♥ Canciones que suenan a ti</span>
          <span className="font-mono text-[10px]">Página 05 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PARTIDAS JUGANDO JUNTOS ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        <div className="flex items-center justify-between mb-4">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 06 • JUGANDO JUNTOS
            </span>
          </div>
          <span className="text-xs font-bold text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5" /> Player 1 & 2
          </span>
        </div>

        <div className="space-y-4 my-auto">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl p-4 shadow-xl border border-purple-500/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest">Dúo Inseparable</span>
              <span className="bg-purple-600/80 px-2 py-0.5 rounded text-[9px] font-bold">VICTORIAS: ∞</span>
            </div>
            <p className="font-hand text-xl text-purple-200">
              "No importa si ganamos o perdemos la partida, jugar contigo siempre es lo más divertido del mundo."
            </p>
          </div>

          <div className="space-y-2.5">
            {games.map((g, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-900 mb-0.5">{g.title}</div>
                <div className="text-[11px] text-slate-600 font-hand text-base">{g.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <span className="font-hand text-base font-bold text-amber-900">
              🎮 Próxima misión: Cenar empanadas y ver una serie juntos
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ El mejor equipo del mundo entero</span>
          <span className="font-mono text-[10px]">Página 06 / 500</span>
        </div>
      </div>
    </div>
  );
};
