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
} from 'lucide-react';
import { SongItem } from '../types';
import { romanticAudio } from '../utils/audio';

interface MusicPlayerProps {
  songs: SongItem[];
  onUpdateSongs?: (newSongs: SongItem[]) => void;
  isAdmin?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  songs,
  onUpdateSongs,
  isAdmin = false,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding songs
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newType, setNewType] = useState<'spotify' | 'youtube' | 'local'>('spotify');
  const [newUrl, setNewUrl] = useState('');
  const [localFileName, setLocalFileName] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex] || songs[0];

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

    if (currentSong.type === 'synth') {
      const playing = romanticAudio.toggleRomanticPiano();
      setIsPlaying(playing);
    } else if (currentSong.type === 'local') {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser autoplay policy
              setIsPlaying(false);
            });
        }
      }
    } else {
      // External players (Spotify / YouTube embed)
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentSong.type === 'synth') {
      romanticAudio.toggleRomanticPiano(false);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    if (currentSong.type === 'synth') {
      romanticAudio.toggleRomanticPiano(false);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    setIsPlaying(false);
  };

  // Convert Spotify URL to Embed URL
  const getSpotifyEmbedUrl = (url: string) => {
    // Check if it's already an embed URL
    if (url.includes('spotify.com/embed')) return url;
    // e.g. https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg -> https://open.spotify.com/embed/track/3AJwUDP919kvQ9QcozQPxg
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  };

  // Convert YouTube URL to Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed')) return url;
    let videoId = '';
    let playlistId = '';

    const matchVid = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (matchVid) videoId = matchVid[1];

    const matchPl = url.match(/[?&]list=([^#&?]+)/);
    if (matchPl) playlistId = matchPl[1];

    if (playlistId && !videoId) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`;
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    }
    return url;
  };

  // Handle local audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFileName(file.name);
    setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
    setNewArtist('Pista Personalizada');

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setNewUrl(base64Url);
    };
    reader.readAsDataURL(file);
  };

  // Submit new song to playlist
  const handleAddSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newSong: SongItem = {
      id: `song-${Date.now()}`,
      title: newTitle,
      artist: newArtist || 'Nuestra Canción',
      type: newType,
      url: newUrl,
      duration: newType === 'local' ? 'Audio MP3' : 'En línea',
    };

    const updated = [...songs, newSong];
    onUpdateSongs?.(updated);

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
    if (songs.length <= 1) return;
    const updated = songs.filter((s) => s.id !== id);
    onUpdateSongs?.(updated);
    if (currentSongIndex >= updated.length) {
      setCurrentSongIndex(0);
    }
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

      {/* Floating Music Control Bar */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-rose-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-white">
        {/* Animated Vinyl Icon */}
        <div
          onClick={togglePlay}
          className={`cursor-pointer w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md transition-transform ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Disc3 className="w-5 h-5 text-white" />
        </div>

        {/* Current Track Info */}
        <div
          onClick={() => setShowPlaylist(true)}
          className="cursor-pointer max-w-[110px] sm:max-w-[160px] truncate"
        >
          <p className="text-xs font-semibold text-rose-200 truncate leading-tight">
            {currentSong?.title || 'Música de Amor'}
          </p>
          <p className="text-[10px] text-amber-200/80 truncate">
            {currentSong?.artist || 'Banda Sonora'}
          </p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-white/10 text-rose-300 transition-colors"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-rose-300" /> : <Play className="w-4 h-4 fill-rose-300" />}
        </button>

        {/* Skip Forward */}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
          title="Siguiente pista"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Playlist Toggle */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="p-1.5 rounded-full hover:bg-white/10 text-amber-300 transition-colors relative"
          title="Ver Lista de Reproducción"
        >
          <ListMusic className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors hidden sm:block"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Embedded Spotify / YouTube Player Container if active */}
      {isPlaying && (currentSong.type === 'spotify' || currentSong.type === 'youtube') && (
        <div className="fixed bottom-4 left-4 z-40 w-72 sm:w-80 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-rose-500/40 p-2 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center px-2 py-1 mb-1.5">
            <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-rose-400" />
              {currentSong.type === 'spotify' ? 'Spotify Player' : 'YouTube Player'}
            </span>
            <button
              onClick={() => setIsPlaying(false)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Ocultar
            </button>
          </div>

          {currentSong.type === 'spotify' && (
            <iframe
              src={getSpotifyEmbedUrl(currentSong.url)}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl shadow-inner"
            />
          )}

          {currentSong.type === 'youtube' && (
            <iframe
              src={getYouTubeEmbedUrl(currentSong.url)}
              width="100%"
              height="160"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-inner"
            />
          )}
        </div>
      )}

      {/* Playlist Drawer / Modal */}
      {showPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-rose-400" />
                <h3 className="text-xl font-bold text-rose-100" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Playlist de Nuestro Amor
                </h3>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Song list */}
            <div className="my-4 max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {songs.map((song, idx) => (
                <div
                  key={song.id}
                  onClick={() => {
                    if (currentSong.type === 'synth') {
                      romanticAudio.toggleRomanticPiano(false);
                    }
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    setCurrentSongIndex(idx);
                    setIsPlaying(true);
                    if (song.type === 'synth') {
                      romanticAudio.toggleRomanticPiano(true);
                    } else if (song.type === 'local' && audioRef.current) {
                      setTimeout(() => audioRef.current?.play(), 100);
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    idx === currentSongIndex
                      ? 'bg-rose-950/80 border border-rose-500/60 shadow-lg shadow-rose-950/40 text-amber-200'
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">
                      {idx === currentSongIndex && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-1 h-3 bg-rose-400 animate-pulse" />
                          <span className="w-1 h-2 bg-rose-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <span className="w-1 h-3.5 bg-rose-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate">{song.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>{song.artist}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-mono">
                          {song.type}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">{song.duration || ''}</span>
                    {songs.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteSong(song.id, e)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Eliminar canción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: Add song & Volume slider */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-rose-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Canción / Spotify / YouTube / MP3</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl text-white">
            <h3 className="text-xl font-bold text-rose-200 mb-1" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Añadir Canción a la Boda de Sonidos
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresa un enlace de Spotify, video de YouTube, o sube tu archivo MP3 favorito.
            </p>

            <form onSubmit={handleAddSongSubmit} className="space-y-4">
              {/* Type selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('spotify')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    newType === 'spotify'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  Spotify
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('youtube')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    newType === 'youtube'
                      ? 'bg-red-950/80 border-red-500 text-red-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('local')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    newType === 'local'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  Subir MP3
                </button>
              </div>

              {/* Title & Artist */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Canción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Thinking Out Loud"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Artista / Dedicatoria</label>
                <input
                  type="text"
                  placeholder="Ej: Ed Sheeran / Nuestra canción"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* URL or File Upload depending on type */}
              {newType !== 'local' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {newType === 'spotify'
                      ? 'Enlace de Canción o Playlist de Spotify'
                      : 'Enlace de YouTube (Video o Lista)'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={
                      newType === 'spotify'
                        ? 'https://open.spotify.com/track/...'
                        : 'https://www.youtube.com/watch?v=...'
                    }
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Seleccionar Archivo de Audio (MP3, WAV)
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-amber-400 transition-colors bg-white/5">
                    <Upload className="w-6 h-6 text-amber-400 mb-2" />
                    <span className="text-xs text-slate-300">
                      {localFileName ? localFileName : 'Haz clic para elegir un archivo de tu dispositivo'}
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Submit & Cancel */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newTitle || (!newUrl && !localFileName)}
                  className="w-1/2 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  Guardar Canción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
