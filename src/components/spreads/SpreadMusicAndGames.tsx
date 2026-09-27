import React, { useState } from 'react';
import { Music, Gamepad2, Disc, Play, Pause, Heart, Sparkles, Tv, Radio, ExternalLink } from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';
import { getYouTubeId } from '../MusicPlayer';

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
  onUpdateData,
}) => {
  const songItems = (data.songs && data.songs.length > 0) ? data.songs : [
    {
      id: 'song-1',
      title: 'Melting',
      artist: 'Sonríeme siempre, osito bonito',
      type: 'youtube' as const,
      url: 'https://www.youtube.com/watch?v=xIsCh-BA8Ew',
    },
    {
      id: 'song-2',
      title: 'Perfect',
      artist: 'Ed Sheeran',
      type: 'youtube' as const,
      url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    },
    {
      id: 'song-3',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      type: 'youtube' as const,
      url: 'https://www.youtube.com/watch?v=vGJTaP6anOU',
    },
  ];

  const [selectedSongIdx, setSelectedSongIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'video' | 'cassette'>('video');

  const activeSong = songItems[selectedSongIdx] || songItems[0];
  const ytVideoId = activeSong ? getYouTubeId(activeSong.url) : null;

  const games = data.gamesList || [
    { title: 'Minecraft', desc: 'Nuestra casita de madera y granja de flores 🏡' },
    { title: 'It Takes Two', desc: 'Superando cada nivel en equipo perfecto 🧩' },
    { title: 'Roblox / Party', desc: 'Risas sin parar cuando perdemos juntos 🎮' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* ================= LEFT PAGE: NUESTRAS CANCIONES ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Page Ribbon Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 05 • NUESTRAS CANCIONES
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {ytVideoId && (
              <button
                onClick={() => setViewMode(viewMode === 'video' ? 'cassette' : 'video')}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold border transition bg-white/80 hover:bg-white text-slate-700 border-slate-300 flex items-center gap-1 shadow-sm"
                title="Cambiar entre Video y Cassette"
              >
                {viewMode === 'video' ? '📼 Cassette' : '📺 Video'}
              </button>
            )}

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
        </div>

        <div className="space-y-3.5 my-auto">
          {/* CUADRADO DE YOUTUBE CON EL VIDEO DE LA MÚSICA */}
          {viewMode === 'video' && ytVideoId ? (
            <div className="bg-slate-950 rounded-2xl p-3 shadow-xl border-4 border-slate-800 text-white animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-2 px-1">
                <span className="flex items-center gap-1 font-bold text-red-400">
                  <Tv className="w-3 h-3 text-red-500" /> VIDEO MUSICAL EN VIVO
                </span>
                <span className="truncate max-w-[170px] text-slate-300 font-medium">
                  {activeSong.title}
                </span>
              </div>

              {/* YouTube Video Square Frame */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800 relative">
                <iframe
                  key={ytVideoId}
                  src={`https://www.youtube.com/embed/${ytVideoId}?autoplay=${
                    isPlayingMusic ? 1 : 0
                  }&enablejsapi=1`}
                  title={activeSong.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-400">
                <span className="font-hand text-base text-amber-300 font-bold truncate">
                  {activeSong.artist}
                </span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {isPlayingMusic ? 'Sonando en el libro ♡' : 'Toca el video para reproducir'}
                </span>
              </div>
            </div>
          ) : (
            /* Cassette Graphic View */
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border-4 border-slate-700 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-2">
                <span>CASSETTE MIXTAPE • LADO A</span>
                <span>STEREO DOLBY</span>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-center gap-6 border border-slate-600">
                <div
                  className={`w-14 h-14 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center ${
                    isPlayingMusic ? 'animate-spin' : ''
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-950 rounded-full" />
                </div>
                <div className="text-center">
                  <div className="font-hand text-xl text-amber-300 font-bold">
                    Para {data.recipientName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {activeSong.title}
                  </div>
                </div>
                <div
                  className={`w-14 h-14 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center ${
                    isPlayingMusic ? 'animate-spin' : ''
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-950 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Song list with active selector */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scroll pr-1">
            {songItems.map((song, i) => {
              const isSelected = i === selectedSongIdx;
              const isYT = song.type === 'youtube' || Boolean(getYouTubeId(song.url));

              return (
                <div
                  key={song.id || i}
                  onClick={() => {
                    setSelectedSongIdx(i);
                    setViewMode('video');
                    if (!isPlayingMusic) {
                      onToggleMusic();
                    }
                  }}
                  className={`p-2.5 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300/60'
                      : 'bg-white/80 hover:bg-white border-sky-100 text-slate-800'
                  }`}
                  title="Clic para ver video y reproducir"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <span className="text-base">{isYT ? '🎬' : '🎵'}</span>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{song.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{song.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isYT && (
                      <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Video
                      </span>
                    )}
                    <Music className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-500' : 'text-sky-500'}`} />
                  </div>
                </div>
              );
            })}
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
              <div
                key={idx}
                onClick={() =>
                  onOpenEdit(`Editar Descripción de ${g.title}`, g.desc, 'text', (newDesc) => {
                    const updated = [...games];
                    updated[idx] = { ...updated[idx], desc: newDesc };
                    onUpdateData({ gamesList: updated });
                  })
                }
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-300 transition"
                title="Clic para editar este juego"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans-ui font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                    {g.title}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Online ♡
                  </span>
                </div>
                <p className="text-xs text-slate-600">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Jugando juntos por siempre</span>
          <span className="font-mono text-[10px]">Página 06 / 500</span>
        </div>
      </div>
    </div>
  );
};
