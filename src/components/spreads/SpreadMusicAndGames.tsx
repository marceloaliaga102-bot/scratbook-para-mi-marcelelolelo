import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Gamepad2,
  Play,
  Pause,
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  Heart,
  Sparkles,
  Tv,
  Radio,
  X,
  Check,
  Disc3,
  Flame,
  Volume2,
  VolumeX,
  Share2,
} from 'lucide-react';
import { ScrapbookStore } from '../../data/scrapbookData';
import { MemorySongItem, GameItem } from '../../types';
import { getYouTubeId, getSpotifyTrackId } from '../MusicPlayer';

interface SpreadMusicAndGamesProps {
  data: ScrapbookStore;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onPauseBackgroundMusic?: () => void;
  onOpenEdit: (title: string, value: string, type: 'image' | 'text' | 'textarea', onSave: (val: string) => void) => void;
  onTriggerRain: () => void;
  onUpdateData: (partial: Partial<ScrapbookStore>) => void;
}

export const SpreadMusicAndGames: React.FC<SpreadMusicAndGamesProps> = ({
  data,
  isPlayingMusic,
  onToggleMusic,
  onPauseBackgroundMusic,
  onOpenEdit,
  onTriggerRain,
  onUpdateData,
}) => {
  // 1. Dedicated songs that remind of him (COMPLETELY SEPARATE from global background music playlist)
  const memorySongs: MemorySongItem[] =
    data.songsThatRemindMeOfHim && data.songsThatRemindMeOfHim.length > 0
      ? data.songsThatRemindMeOfHim
      : [
          {
            id: 'mem-1',
            title: 'Melting',
            artist: 'Kali Uchis',
            url: 'https://www.youtube.com/watch?v=xIsCh-BA8Ew',
            note: 'Tu carita hermosa cada vez que me miras y me derrito completo ♡',
            type: 'youtube',
          },
          {
            id: 'mem-2',
            title: 'Until I Found You',
            artist: 'Stephen Sanchez',
            url: 'https://www.youtube.com/watch?v=GxldQ9eX2wo',
            note: 'Porque antes de conocerte no sabía lo que era el amor sincero.',
            type: 'youtube',
          },
          {
            id: 'mem-3',
            title: 'Golden Hour',
            artist: 'JVKE',
            url: 'https://www.youtube.com/watch?v=PEM0Vs8jf1w',
            note: 'Nuestras tardes doradas caminando juntos y mirándonos.',
            type: 'youtube',
          },
          {
            id: 'mem-4',
            title: 'Yellow',
            artist: 'Coldplay',
            url: 'https://www.youtube.com/watch?v=yKNxeF4KMsY',
            note: '"Look at the stars, look how they shine for you..."',
            type: 'youtube',
          },
        ];

  // 2. Local playback state for memory songs (self-contained, does not tamper with data.songs)
  const [activeMemorySongId, setActiveMemorySongId] = useState<string | null>(null);
  const [isLocalSongPlaying, setIsLocalSongPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active song object
  const currentSong = memorySongs.find((s) => s.id === activeMemorySongId) || memorySongs[0];
  const ytVideoId = currentSong?.url ? getYouTubeId(currentSong.url) : null;
  const spotifyTrackId = currentSong?.url ? getSpotifyTrackId(currentSong.url) : null;

  // Modal to Add / Edit Memory Song
  const [songModalOpen, setSongModalOpen] = useState(false);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [songFormTitle, setSongFormTitle] = useState('');
  const [songFormArtist, setSongFormArtist] = useState('');
  const [songFormUrl, setSongFormUrl] = useState('');
  const [songFormNote, setSongFormNote] = useState('');

  // 3. Games list (with URLs to click and play!)
  const gamesList: Array<{ id?: string; title: string; desc: string; url?: string }> =
    data.gamesList && data.gamesList.length > 0
      ? data.gamesList
      : [
          {
            id: 'game-minecraft',
            title: 'Minecraft',
            desc: 'Nuestra casita de madera, los perritos y la granja de flores 🏡',
            url: 'https://classic.minecraft.net/',
          },
          {
            id: 'game-roblox',
            title: 'Roblox / Party',
            desc: 'Risas sin parar cuando perdemos en los obbies y minijuegos juntos 🎮',
            url: 'https://www.roblox.com/',
          },
          {
            id: 'game-ittakestwo',
            title: 'It Takes Two',
            desc: 'Superando cada nivel en equipo perfecto, Cody & May 🧩',
            url: 'https://store.steampowered.com/app/1426210/It_Takes_Two/',
          },
        ];

  // Modal to Add / Edit Game
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [editingGameIdx, setEditingGameIdx] = useState<number | null>(null);
  const [gameFormTitle, setGameFormTitle] = useState('');
  const [gameFormDesc, setGameFormDesc] = useState('');
  const [gameFormUrl, setGameFormUrl] = useState('');

  // Built-in Love Mini-Game Modal ("Ruleta de Retos & Preguntas de Amor")
  const [miniGameOpen, setMiniGameOpen] = useState(false);
  const [loveCardIdx, setLoveCardIdx] = useState(0);
  const loveCards = [
    { title: 'Pregunta para ti 💕', text: '¿Cuál fue el segundo exacto en el que te diste cuenta de que me querías tanto?' },
    { title: 'Reto de amor 🫂', text: 'Mándame un audio de 10 segundos diciéndome lo primero lindo que se te venga a la mente.' },
    { title: 'Nuestra Cita Soñada ✨', text: 'Si pudiéramos teletransportarnos ahora mismo, ¿a qué lugar del mundo iríamos a cenar?' },
    { title: 'Recuerdo Favorito 🥟', text: '¿Te acuerdas de la risa más fuerte que tuvimos juntos? Cuéntamela como si fuera hoy.' },
    { title: 'Promesa Eterna 💍', text: 'No importa cuántos años pasen, siempre seremos los mejores compañeros de partida.' },
  ];

  // Stop local audio if song unmounts or changes
  const handleTogglePlaySong = (song: MemorySongItem) => {
    if (activeMemorySongId === song.id && isLocalSongPlaying) {
      // Pause
      setIsLocalSongPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Start playing this memory song
      setActiveMemorySongId(song.id);
      setIsLocalSongPlaying(true);

      // If background music is playing, pause it so they don't collide!
      if (isPlayingMusic && onPauseBackgroundMusic) {
        onPauseBackgroundMusic();
      }

      // If direct audio URL
      if (!getYouTubeId(song.url) && !getSpotifyTrackId(song.url)) {
        if (audioRef.current) {
          audioRef.current.src = song.url;
          audioRef.current.play().catch(() => {});
        }
      }
    }
  };

  // Open add song modal
  const openAddSongModal = () => {
    setEditingSongId(null);
    setSongFormTitle('');
    setSongFormArtist('');
    setSongFormUrl('');
    setSongFormNote('');
    setSongModalOpen(true);
  };

  // Open edit song modal
  const openEditSongModal = (song: MemorySongItem) => {
    setEditingSongId(song.id);
    setSongFormTitle(song.title);
    setSongFormArtist(song.artist || '');
    setSongFormUrl(song.url);
    setSongFormNote(song.note || '');
    setSongModalOpen(true);
  };

  // Save song
  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFormTitle.trim()) return;

    let updated: MemorySongItem[];
    if (editingSongId) {
      updated = memorySongs.map((s) =>
        s.id === editingSongId
          ? {
              ...s,
              title: songFormTitle.trim(),
              artist: songFormArtist.trim() || 'Para ti',
              url: songFormUrl.trim(),
              note: songFormNote.trim(),
            }
          : s
      );
    } else {
      const newSong: MemorySongItem = {
        id: `mem-${Date.now()}`,
        title: songFormTitle.trim(),
        artist: songFormArtist.trim() || 'Para ti',
        url: songFormUrl.trim() || 'https://www.youtube.com',
        note: songFormNote.trim() || 'Me recuerda a ti siempre ♡',
      };
      updated = [newSong, ...memorySongs];
      setActiveMemorySongId(newSong.id);
      setIsLocalSongPlaying(true);
      if (isPlayingMusic && onPauseBackgroundMusic) {
        onPauseBackgroundMusic();
      }
    }

    onUpdateData({ songsThatRemindMeOfHim: updated });
    setSongModalOpen(false);
  };

  // Delete song
  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Quieres quitar esta canción de tu lista de recuerdos?')) {
      const updated = memorySongs.filter((s) => s.id !== id);
      if (activeMemorySongId === id) {
        setIsLocalSongPlaying(false);
        setActiveMemorySongId(null);
      }
      onUpdateData({ songsThatRemindMeOfHim: updated });
    }
  };

  // Open add game modal
  const openAddGameModal = () => {
    setEditingGameIdx(null);
    setGameFormTitle('');
    setGameFormDesc('');
    setGameFormUrl('');
    setGameModalOpen(true);
  };

  // Open edit game modal
  const openEditGameModal = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const g = gamesList[idx];
    setEditingGameIdx(idx);
    setGameFormTitle(g.title);
    setGameFormDesc(g.desc);
    setGameFormUrl(g.url || '');
    setGameModalOpen(true);
  };

  // Save game
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameFormTitle.trim()) return;

    let updated = [...gamesList];
    if (editingGameIdx !== null) {
      updated[editingGameIdx] = {
        ...updated[editingGameIdx],
        title: gameFormTitle.trim(),
        desc: gameFormDesc.trim(),
        url: gameFormUrl.trim(),
      };
    } else {
      updated.push({
        id: `game-${Date.now()}`,
        title: gameFormTitle.trim(),
        desc: gameFormDesc.trim() || '¡Nuestra próxima gran partida juntos!',
        url: gameFormUrl.trim() || 'https://www.roblox.com',
      });
    }

    onUpdateData({ gamesList: updated });
    setGameModalOpen(false);
  };

  // Delete game
  const handleDeleteGame = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar este juego de la lista?')) {
      const updated = gamesList.filter((_, i) => i !== idx);
      onUpdateData({ gamesList: updated });
    }
  };

  // Function to go to the game when clicked
  const handleGoToGame = (url?: string, title?: string) => {
    if (!url || url === '#' || url === '') {
      // If no url set, search game or open mini-game
      window.open(`https://www.google.com/search?q=${encodeURIComponent('jugar ' + (title || 'videojuego'))}`, '_blank');
      return;
    }

    if (url.startsWith('#')) {
      setMiniGameOpen(true);
      return;
    }

    // Open target game in new tab!
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {/* Hidden audio element for direct audio URLs */}
      <audio ref={audioRef} onEnded={() => setIsLocalSongPlaying(false)} />

      {/* ================= LEFT PAGE: CANCIONES QUE ME RECUERDAN A ÉL ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-left border-r border-slate-300/40 min-h-[720px]">
        {/* Page Ribbon Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="washi-tape-cyan px-4 py-1.5 -rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-sky-950 uppercase">
              PÁGINA 05 • CANCIONES QUE ME RECUERDAN A ÉL
            </span>
          </div>

          <button
            onClick={openAddSongModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition shadow-md hover:scale-105"
            title="Agregar una canción que te recuerda a él"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Canción</span>
          </button>
        </div>

        <div className="space-y-3.5 my-auto">
          {/* Mini Dedicated Player Screen (Only plays the memory song chosen here, independent from site background music) */}
          <div className="bg-slate-950 rounded-2xl p-3.5 shadow-xl border-4 border-slate-800 text-white relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-2 px-1">
              <span className="flex items-center gap-1.5 font-bold text-rose-400">
                <Music className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                <span>CANCIÓN ESPECIAL PARA ÉL</span>
              </span>
              <span className="truncate max-w-[170px] text-slate-300 font-medium">
                {currentSong ? currentSong.title : 'Selecciona una canción'}
              </span>
            </div>

            {/* Video / Player Container */}
            {ytVideoId ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-slate-800 relative">
                {isLocalSongPlaying && activeMemorySongId === currentSong.id ? (
                  <iframe
                    key={ytVideoId}
                    src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1&enablejsapi=1`}
                    title={currentSong.title}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => currentSong && handleTogglePlaySong(currentSong)}
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-rose-950/40 to-slate-900 cursor-pointer group p-4 text-center hover:bg-black/60 transition"
                  >
                    <div className="w-14 h-14 rounded-full bg-rose-500/90 group-hover:bg-rose-500 group-hover:scale-110 flex items-center justify-center text-white shadow-lg transition mb-2">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-rose-200">
                      Toca para reproducir esta canción aquí
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      (No afecta la música de fondo de la web)
                    </span>
                  </div>
                )}
              </div>
            ) : spotifyTrackId ? (
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-1">
                <iframe
                  src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            ) : (
              /* Cassette Aesthetic Player */
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center ${
                      isLocalSongPlaying ? 'animate-spin' : ''
                    }`}
                  >
                    <div className="w-3 h-3 bg-slate-950 rounded-full" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-amber-200 truncate max-w-[200px]">
                      {currentSong?.title || 'Canción de amor'}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {currentSong?.artist || 'Dedicada para ti'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => currentSong && handleTogglePlaySong(currentSong)}
                    className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    {isLocalSongPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pausar Canción
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" /> Escuchar Aquí
                      </>
                    )}
                  </button>
                  {currentSong?.url && (
                    <a
                      href={currentSong.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Abrir Link
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Note & Dedication of active song */}
            {currentSong?.note && (
              <div className="mt-2.5 p-2 rounded-xl bg-slate-900/90 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-rose-500/30 mt-0.5" />
                <span className="font-hand text-sm leading-tight italic">
                  "{currentSong.note}"
                </span>
              </div>
            )}
          </div>

          {/* List of memory songs with controls */}
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scroll pr-1">
            <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between px-1">
              <span>LISTA DE CANCIONES ({memorySongs.length})</span>
              <span className="text-[10px] text-slate-400">Exclusivas de esta página</span>
            </div>

            {memorySongs.map((song) => {
              const isActive = activeMemorySongId === song.id;
              const isPlaying = isActive && isLocalSongPlaying;
              const hasYT = Boolean(getYouTubeId(song.url));

              return (
                <div
                  key={song.id}
                  onClick={() => handleTogglePlaySong(song)}
                  className={`p-2.5 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
                    isActive
                      ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300/60'
                      : 'bg-white/90 hover:bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlaySong(song);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                        isPlaying
                          ? 'bg-rose-500 text-white shadow-md animate-pulse'
                          : 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600'
                      }`}
                      title={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="truncate">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{song.title}</span>
                        {hasYT && (
                          <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded font-mono">
                            YT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                        <span>{song.artist || 'Dedicada para ti'}</span>
                        {song.note && <span className="text-rose-400 truncate">• {song.note}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {song.url && (
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition"
                        title="Abrir enlace original"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => openEditSongModal(song)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                      title="Editar canción o dedicatoria"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSong(song.id, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Canciones que me recuerdan a ti</span>
          <span className="font-mono text-[10px]">Página 05 / 500</span>
        </div>
      </div>

      {/* ================= RIGHT PAGE: PARTIDAS JUGANDO JUNTOS ================= */}
      <div className="bg-paper-texture p-6 sm:p-8 flex flex-col justify-between relative book-spine-shadow-right min-h-[720px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="washi-tape-pink px-4 py-1.5 rotate-1 rounded shadow-sm inline-block">
            <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-rose-950 uppercase">
              PÁGINA 06 • JUGANDO JUNTOS
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMiniGameOpen(true)}
              className="px-2.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 text-xs font-bold transition flex items-center gap-1 shadow-sm"
              title="Jugar reto de parejas aquí en el libro"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Minijuego ♡</span>
            </button>

            <button
              onClick={openAddGameModal}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition shadow-md hover:scale-105"
              title="Agregar un juego nuevo a la lista"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Juego</span>
            </button>
          </div>
        </div>

        <div className="space-y-3.5 my-auto">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white rounded-2xl p-4 shadow-xl border border-purple-500/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest flex items-center gap-1">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Dúo Inseparable en Cada Partida</span>
              </span>
              <span className="bg-purple-600/80 px-2 py-0.5 rounded text-[9px] font-bold">
                VICTORIAS: ∞
              </span>
            </div>
            <p className="font-hand text-lg text-purple-100 leading-snug">
              "No importa si ganamos o perdemos la partida, jugar contigo siempre es lo más divertido del mundo."
            </p>
          </div>

          {/* Interactive Games List (With direct button to go to the game!) */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto custom-scroll pr-1">
            {gamesList.map((game, idx) => (
              <div
                key={game.id || idx}
                className="bg-white/95 border-2 border-slate-200 hover:border-purple-400 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans-ui font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
                      <Gamepad2 className="w-4 h-4" />
                    </span>
                    <span>{game.title}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Online ♡
                    </span>
                    <button
                      onClick={(e) => openEditGameModal(idx, e)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                      title="Editar enlace o descripción del juego"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteGame(idx, e)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Eliminar juego"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 pl-8">{game.desc}</p>

                {/* Primary Button to GO TO THE GAME! */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleGoToGame(game.url, game.title)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.02]"
                    title={`Abrir y jugar ${game.title}`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Jugar a {game.title}</span>
                    <ExternalLink className="w-3 h-3 text-purple-200" />
                  </button>

                  {game.url && (
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]" title={game.url}>
                      {game.url.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">♥ Jugando juntos por siempre</span>
          <span className="font-mono text-[10px]">Página 06 / 500</span>
        </div>
      </div>

      {/* ================= MODAL: AGREGAR / EDITAR CANCIÓN QUE ME RECUERDA A ÉL ================= */}
      {songModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/50 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <Music className="w-4 h-4" />
                </span>
                <h3 className="font-fancy text-lg font-bold text-rose-200">
                  {editingSongId ? 'Editar Canción de Recuerdos' : 'Nueva Canción que me Recuerda a Él'}
                </h3>
              </div>
              <button
                onClick={() => setSongModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSong} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título de la Canción *</label>
                <input
                  type="text"
                  placeholder="ej. Melting, Golden Hour, Lover..."
                  value={songFormTitle}
                  onChange={(e) => setSongFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-rose-400"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Artista o Dedicatoria</label>
                <input
                  type="text"
                  placeholder="ej. Kali Uchis (o 'Para mi niño hermoso')"
                  value={songFormArtist}
                  onChange={(e) => setSongFormArtist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Enlace de la Canción (YouTube o Spotify) *
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... o https://open.spotify.com/track/..."
                  value={songFormUrl}
                  onChange={(e) => setSongFormUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-200 font-mono text-[11px] outline-none focus:border-rose-400"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Puedes pegar cualquier enlace de YouTube o Spotify para reproducirlo en la página.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  ¿Por qué te recuerda a él? (Dedicatoria)
                </label>
                <textarea
                  rows={3}
                  placeholder="ej. Porque cada vez que la escucho me imagino caminando juntos abrazados..."
                  value={songFormNote}
                  onChange={(e) => setSongFormNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSongModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Canción</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AGREGAR / EDITAR JUEGO ================= */}
      {gameModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border-2 border-purple-500/50 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Gamepad2 className="w-4 h-4" />
                </span>
                <h3 className="font-fancy text-lg font-bold text-purple-200">
                  {editingGameIdx !== null ? 'Editar Juego' : 'Agregar Nuevo Juego'}
                </h3>
              </div>
              <button
                onClick={() => setGameModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre del Juego *</label>
                <input
                  type="text"
                  placeholder="ej. Minecraft, Roblox, Stardew Valley, Valorant..."
                  value={gameFormTitle}
                  onChange={(e) => setGameFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-purple-400"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Enlace para Ir al Juego (URL) *
                </label>
                <input
                  type="url"
                  placeholder="https://... (enlace a web, servidor, Steam o Roblox)"
                  value={gameFormUrl}
                  onChange={(e) => setGameFormUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-200 font-mono text-[11px] outline-none focus:border-purple-400"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Al presionar el botón del juego en el libro, se abrirá este enlace directamente.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Descripción o Anécdota Jugando Juntos
                </label>
                <textarea
                  rows={2}
                  placeholder="ej. Nuestra casita de madera y risas cuando morimos en el juego 🎮"
                  value={gameFormDesc}
                  onChange={(e) => setGameFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGameModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Juego</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MINIJUEGO DE PAREJA DENTRO DEL LIBRO ================= */}
      {miniGameOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-b from-purple-950 to-slate-950 border-2 border-purple-500/60 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-purple-800/40">
              <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> RETO DE AMOR # {loveCardIdx + 1} DE {loveCards.length}
              </span>
              <button
                onClick={() => setMiniGameOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-purple-900/40 border border-purple-500/30 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center mx-auto text-xl">
                💌
              </div>
              <h4 className="font-fancy text-lg font-bold text-purple-200">
                {loveCards[loveCardIdx].title}
              </h4>
              <p className="font-hand text-xl text-amber-100 leading-snug">
                "{loveCards[loveCardIdx].text}"
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => setLoveCardIdx((prev) => (prev + 1) % loveCards.length)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition"
              >
                Siguiente Tarjeta 💕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
