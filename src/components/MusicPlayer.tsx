import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Upload,
  Plus,
  Radio,
  ExternalLink,
  Disc3,
  ListMusic,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Tv,
  Maximize2,
  Minimize2,
  Video,
} from 'lucide-react';
import { SongItem } from '../types';
import { romanticAudio } from '../utils/romanticAudio';

interface MusicPlayerProps {
  songs: SongItem[];
  onUpdateSongs?: (newSongs: SongItem[]) => void;
  isAdmin?: boolean;
  isPlaying?: boolean;
  onPlayChange?: (playing: boolean) => void;
}

export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function getSpotifyTrackId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  songs,
  onUpdateSongs,
  isAdmin = false,
  isPlaying: externalIsPlaying,
  onPlayChange,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalPlaying;
  const setIsPlaying = (val: boolean) => {
    setInternalPlaying(val);
    onPlayChange?.(val);
  };
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVideoSquare, setShowVideoSquare] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form state for adding songs
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newType, setNewType] = useState<'spotify' | 'youtube' | 'local'>('youtube');
  const [newUrl, setNewUrl] = useState('');
  const [localFileName, setLocalFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex] || songs[0];
  const currentYouTubeId = currentSong ? getYouTubeId(currentSong.url) : null;
  const currentSpotifyId = currentSong ? getSpotifyTrackId(currentSong.url) : null;
  const isYouTubeSong = currentSong?.type === 'youtube' || Boolean(currentYouTubeId);

  // Sync volume with audio element and synthesized piano
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
    romanticAudio.setVolume(effectiveVol);
  }, [volume, isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!currentSong) return;

    if (isPlaying) {
      if (currentSong.type === 'synth') {
        romanticAudio.stop();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentSong.type === 'synth') {
        romanticAudio.start();
        setIsPlaying(true);
      } else if (audioRef.current && currentSong.type === 'local') {
        romanticAudio.stop();
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback error:', err);
            romanticAudio.start();
            setIsPlaying(true);
          });
      } else {
        // YouTube, Spotify, or external stream
        romanticAudio.stop();
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(true);
        setShowVideoSquare(true); // Open the video square so user sees and hears it
      }
    }
  };

  // Skip Next
  const handleNext = () => {
    if (songs.length <= 1) return;
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
    setShowVideoSquare(true);

    const nextSong = songs[nextIdx];
    if (nextSong?.type === 'synth') {
      if (audioRef.current) audioRef.current.pause();
      romanticAudio.start();
    } else if (nextSong?.type === 'local') {
      romanticAudio.stop();
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play().catch(() => {});
      }, 100);
    } else {
      romanticAudio.stop();
      if (audioRef.current) audioRef.current.pause();
    }
  };

  // Skip Previous
  const handlePrev = () => {
    if (songs.length <= 1) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    setIsPlaying(true);
    setShowVideoSquare(true);

    const prevSong = songs[prevIdx];
    if (prevSong?.type === 'synth') {
      if (audioRef.current) audioRef.current.pause();
      romanticAudio.start();
    } else if (prevSong?.type === 'local') {
      romanticAudio.stop();
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play().catch(() => {});
      }, 100);
    } else {
      romanticAudio.stop();
      if (audioRef.current) audioRef.current.pause();
    }
  };

  // Select song from playlist
  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
    setShowPlaylist(false);
    setIsPlaying(true);
    setShowVideoSquare(true);

    const chosen = songs[index];
    if (chosen?.type === 'synth') {
      if (audioRef.current) audioRef.current.pause();
      romanticAudio.start();
    } else if (chosen?.type === 'local') {
      romanticAudio.stop();
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play().catch(() => {});
      }, 100);
    } else {
      romanticAudio.stop();
      if (audioRef.current) audioRef.current.pause();
    }
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFileName(file.name);
    setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
    setNewArtist('Nuestra Canción');
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setNewUrl(base64Url);
    };
    reader.readAsDataURL(file);
  };

  // Submit new song to playlist
  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      setUploadError('Por favor ingresa un título y enlace o archivo');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const cleanSong: SongItem = {
      id: `song-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Nuestra Canción',
      type: newType,
      url: newUrl.trim(),
      duration: newType === 'local' ? 'Audio MP3' : 'En línea',
    };

    // Save to Cloud SQL / backend
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cleanSong.title,
          artist: cleanSong.artist,
          url: cleanSong.url,
          type: cleanSong.type,
          duration: cleanSong.duration,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.song) {
          cleanSong.id = `db-${data.song.id}`;
          if (data.song.url) {
            cleanSong.url = data.song.url;
          }
        }
      }
    } catch (err) {
      console.warn('Backend song save notice:', err);
    } finally {
      setIsUploading(false);
    }

    const updated = [...songs, cleanSong];
    onUpdateSongs?.(updated);

    // Auto-select and play the newly added song
    setCurrentSongIndex(updated.length - 1);
    setIsPlaying(true);
    setShowVideoSquare(true);

    // Reset form
    setNewTitle('');
    setNewArtist('');
    setNewUrl('');
    setLocalFileName('');
    setShowAddModal(false);
  };

  // Delete song
  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const songToDelete = songs.find((s) => s.id === id);
    const updated = songs.filter((s) => s.id !== id);

    onUpdateSongs?.(updated);

    if (currentSongIndex >= updated.length) {
      setCurrentSongIndex(Math.max(0, updated.length - 1));
    }

    fetch(`/api/songs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: songToDelete?.url }),
    }).catch((err) => console.warn('Failed to delete song from backend:', err));
  };

  return (
    <>
      {/* Hidden standard HTML5 audio for local uploaded files */}
      {currentSong && currentSong.type === 'local' && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onEnded={handleNext}
          loop={false}
        />
      )}

      {/* ================= FLOATING YOUTUBE / SPOTIFY VIDEO SQUARE ================= */}
      {/* El cuadrado de YouTube con el vídeo de la música en la esquina baja izquierda y tamaño compacto */}
      {isYouTubeSong && currentYouTubeId && showVideoSquare && !isMinimized && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] animate-fadeIn">
          <div className="w-[210px] sm:w-[250px] bg-slate-950/95 rounded-2xl border-2 border-rose-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-2 backdrop-blur-md text-white">
            {/* Top header bar of video square */}
            <div className="flex items-center justify-between pb-1.5 px-0.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                  <Tv className="w-2.5 h-2.5" /> YouTube
                </span>
                <span className="text-[11px] font-bold text-rose-200 truncate">
                  {currentSong?.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowVideoSquare(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
                  title="Ocultar video (la música seguirá sonando)"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Embedded YouTube Player Iframe */}
            <div className="aspect-video w-full rounded-xl overflow-hidden mt-1.5 bg-black relative shadow-inner border border-slate-800">
              <iframe
                key={currentYouTubeId}
                src={`https://www.youtube.com/embed/${currentYouTubeId}?autoplay=${
                  isPlaying ? 1 : 0
                }&enablejsapi=1&origin=${
                  typeof window !== 'undefined' ? window.location.origin : ''
                }`}
                title={currentSong.title}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video footer info */}
            <div className="flex items-center justify-between pt-1.5 px-0.5 text-[10px] text-slate-400">
              <span className="truncate max-w-[130px] font-medium text-amber-200">
                {currentSong?.artist}
              </span>
              <span className="text-[9px] text-rose-400 font-mono">
                {isPlaying ? '● En vivo' : '⏸ Pausa'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Spotify Embed Player Square */}
      {currentSong?.type === 'spotify' && currentSpotifyId && showVideoSquare && !isMinimized && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] animate-fadeIn">
          <div className="w-[210px] sm:w-[250px] bg-slate-950/95 rounded-2xl border-2 border-emerald-500/50 shadow-2xl p-2 backdrop-blur-md text-white">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                Spotify Player
              </span>
              <button
                onClick={() => setShowVideoSquare(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <iframe
              src={`https://open.spotify.com/embed/track/${currentSpotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              className="rounded-xl mt-1"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* ================= FLOATING MUSIC BAR CONTROLLER ================= */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60]">
        {isMinimized ? (
          /* Minimized circular vinyl button */
          <div
            onClick={() => setIsMinimized(false)}
            className="group relative cursor-pointer flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 backdrop-blur-md p-2 rounded-full border-2 border-rose-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-white transition hover:scale-105"
            title="Abrir reproductor de música y video"
          >
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
            >
              <Disc3 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden group-hover:flex flex-col pr-3">
              <span className="text-xs font-bold text-rose-200 truncate max-w-[130px]">
                {currentSong?.title || 'Música'}
              </span>
              <span className="text-[10px] text-amber-200/80">
                {isPlaying ? 'Reproduciendo...' : 'Pausado'}
              </span>
            </div>
          </div>
        ) : (
          /* Full Compact Bar with YouTube Video Controls */
          <div className="flex items-center gap-2 bg-slate-950/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border-2 border-rose-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.75)] text-white animate-fadeIn">
            {/* Animated Vinyl Icon */}
            <div
              onClick={togglePlay}
              className={`cursor-pointer w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '4s' }}
              title={isPlaying ? 'Pausar música' : 'Reproducir música'}
            >
              <Disc3 className="w-5 h-5 text-white" />
            </div>

            {/* Current Track Info */}
            <div
              onClick={() => setShowPlaylist(true)}
              className="cursor-pointer max-w-[110px] sm:max-w-[160px] truncate"
              title="Clic para ver lista de canciones"
            >
              <p className="text-xs font-bold text-rose-200 truncate leading-tight">
                {currentSong?.title || 'Música Romántica'}
              </p>
              <p className="text-[10px] text-amber-200/90 truncate flex items-center gap-1">
                {isYouTubeSong && (
                  <span className="text-[9px] bg-red-600/80 text-white px-1 rounded font-bold">
                    YT
                  </span>
                )}
                <span>{currentSong?.artist || 'Banda Sonora'}</span>
              </p>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full hover:bg-white/10 text-rose-300 transition-colors"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-rose-300" />
              ) : (
                <Play className="w-5 h-5 fill-rose-300" />
              )}
            </button>

            {/* Skip Previous */}
            <button
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors hidden sm:block"
              title="Pista anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
              title="Siguiente pista"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Toggle YouTube Video Square Button */}
            {isYouTubeSong && (
              <button
                onClick={() => setShowVideoSquare(!showVideoSquare)}
                className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                  showVideoSquare
                    ? 'bg-red-600/30 border-red-500 text-red-200 shadow-sm'
                    : 'bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
                title={
                  showVideoSquare
                    ? 'Ocultar cuadrado de video'
                    : 'Mostrar cuadrado de video de YouTube'
                }
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline text-[10px]">Video</span>
              </button>
            )}

            {/* Playlist Toggle */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-1.5 rounded-full hover:bg-white/10 text-amber-300 transition-colors relative"
              title="Ver Playlist Completa"
            >
              <ListMusic className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Mute toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 transition-colors hidden sm:block"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              title="Minimizar reproductor a icono de vinilo"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================= PLAYLIST DRAWER / MODAL ================= */}
      {showPlaylist && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scroll">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-400" />
                <h3 className="font-fancy text-xl font-bold text-rose-200">
                  Nuestra Playlist de Amor
                </h3>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add song button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Canción (YouTube / Spotify / MP3)</span>
            </button>

            {/* Song list */}
            <div className="space-y-2 mt-3">
              {songs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No hay canciones en la lista. ¡Añade tu primera canción!
                </div>
              ) : (
                songs.map((song, idx) => {
                  const isCurrent = idx === currentSongIndex;
                  return (
                    <div
                      key={song.id || idx}
                      onClick={() => handleSelectSong(idx)}
                      className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition border ${
                        isCurrent
                          ? 'bg-rose-500/20 border-rose-500/50 text-white shadow'
                          : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            isCurrent
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {isCurrent && isPlaying ? (
                            <Play className="w-3.5 h-3.5 fill-white" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="truncate">
                          <p
                            className={`text-xs font-bold truncate ${
                              isCurrent ? 'text-rose-200' : 'text-slate-200'
                            }`}
                          >
                            {song.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            song.type === 'youtube'
                              ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                              : song.type === 'spotify'
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-950/40 text-slate-400'
                          }`}
                        >
                          {song.type}
                        </span>
                        {/* Delete song button */}
                        <button
                          onClick={(e) => handleDeleteSong(song.id, e)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                          title="Eliminar canción de la lista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD SONG MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-fancy text-xl font-bold text-amber-200">
                Añadir Canción
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500 text-rose-200 text-xs rounded-xl">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleAddSongSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tipo de Fuente
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('youtube')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      newType === 'youtube'
                        ? 'bg-red-500/30 border-red-400 text-red-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('spotify')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      newType === 'spotify'
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Spotify
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('local')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      newType === 'local'
                        ? 'bg-sky-500/30 border-sky-400 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    MP3 / Audio
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título de la Canción
                </label>
                <input
                  type="text"
                  placeholder="Ej: Melting"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-rose-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Artista / Dedicatoria
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sonríeme siempre, osito bonito"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-rose-400 outline-none"
                />
              </div>

              {newType === 'local' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Archivo de Audio (MP3, WAV, M4A)
                  </label>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-sky-400 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-300 font-medium">
                      {localFileName || 'Haz clic para seleccionar tu audio'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Sube tu canción favorita para escucharla mientras lees
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {newType === 'youtube'
                      ? 'Enlace de YouTube (Video o Canción)'
                      : 'URL de Spotify'}
                  </label>
                  <input
                    type="url"
                    placeholder={
                      newType === 'youtube'
                        ? 'https://www.youtube.com/watch?v=...'
                        : 'https://open.spotify.com/track/...'
                    }
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-rose-400 outline-none"
                    required
                  />
                  {newType === 'youtube' && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      El video aparecerá en el cuadrado interactivo de YouTube con música
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                {isUploading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Guardando canción...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Guardar y Reproducir Ahora</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
