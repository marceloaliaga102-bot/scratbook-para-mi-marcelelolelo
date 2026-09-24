import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Music,
  Disc,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Cloud,
  Check,
  Moon,
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';
import { ScrapbookStore, defaultScrapbookData } from './data/scrapbookData';
import { EmpanadaRain } from './components/EmpanadaRain';
import { EditItemModal } from './components/EditItemModal';
import { SecretLetterModal } from './components/SecretLetterModal';
import { AdminModal } from './components/AdminModal';
import { MusicPlayer } from './components/MusicPlayer';
import { romanticAudio } from './utils/romanticAudio';
import { subscribeToScrapbook, saveScrapbookToCloud } from './firebase';
import { SongItem } from './types';

// Spreads
import { SpreadCover } from './components/spreads/SpreadCover';
import { SpreadSpecialMoments } from './components/spreads/SpreadSpecialMoments';
import { SpreadMusicAndGames } from './components/spreads/SpreadMusicAndGames';
import { SpreadHeartMosaic } from './components/spreads/SpreadHeartMosaic';
import { SpreadSocialFeed } from './components/spreads/SpreadSocialFeed';
import { SpreadTinAndDenim } from './components/spreads/SpreadTinAndDenim';
import { SpreadAchievements } from './components/spreads/SpreadAchievements';
import { SpreadThingsWeLove } from './components/spreads/SpreadThingsWeLove';
import { SpreadVinylAndTenThings } from './components/spreads/SpreadVinylAndTenThings';

const CHAPTERS = [
  { id: 0, label: '📖 Pág 1-2: Portada & Carta', pageStart: 1, pageEnd: 2 },
  { id: 1, label: '❤️ Pág 3-4: Momentos Especiales', pageStart: 3, pageEnd: 4 },
  { id: 2, label: '🎵 Pág 5-6: Nuestras Canciones & Juegos', pageStart: 5, pageEnd: 6 },
  { id: 3, label: '💖 Pág 7-8: Mosaico Corazón', pageStart: 7, pageEnd: 8 },
  { id: 4, label: '📷 Pág 9-10: Diario de Redes Sociales', pageStart: 9, pageEnd: 10 },
  { id: 5, label: '✨ Pág 17-18: Cajita & Bolsillo Denim', pageStart: 17, pageEnd: 18 },
  { id: 6, label: '🌟 Pág 19-20: Logros & Vintage Moments', pageStart: 19, pageEnd: 20 },
  { id: 7, label: '🎬 Pág 21-22: Things we love & TV Retro', pageStart: 21, pageEnd: 22 },
  { id: 8, label: '🎶 Pág 23-24: Vinilo & 10 Cosas', pageStart: 23, pageEnd: 24 },
];

export default function App() {
  const [data, setData] = useState<ScrapbookStore>(() => {
    try {
      const local = localStorage.getItem('scrapbook_500_data');
      if (local) {
        return { ...defaultScrapbookData, ...JSON.parse(local) };
      }
    } catch {
      // Fallback
    }
    return defaultScrapbookData;
  });

  const [currentSpread, setCurrentSpread] = useState(4); // Start on Pág 9-10
  const [rainTrigger, setRainTrigger] = useState(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(true);
  const [syncStatusText, setSyncStatusText] = useState<string>('Conectado en la nube');

  // Playlist state with uploaded & custom songs
  const [songs, setSongs] = useState<SongItem[]>([
    {
      id: 'synth-1',
      title: 'Melodía Romántica en Piano',
      artist: 'Nuestra Historia de Amor',
      type: 'synth',
      url: 'synth',
      duration: 'Ambiental',
    },
    {
      id: 'yt-1',
      title: 'Ed Sheeran - Perfect',
      artist: 'Ed Sheeran',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      duration: '4:23',
    },
    {
      id: 'spot-1',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      type: 'spotify',
      url: 'https://open.spotify.com/track/44AyOl4qVkzS48vBsbNXaC',
      duration: '3:00',
    },
  ]);

  // Movable moon coordinates
  const [moonPos, setMoonPos] = useState({ x: 75, y: 15 });
  const [isDraggingMoon, setIsDraggingMoon] = useState(false);

  // Edit item modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    title: string;
    value: string;
    type: 'image' | 'text' | 'textarea';
    onSave: (val: string) => void;
  }>({
    isOpen: false,
    title: '',
    value: '',
    type: 'text',
    onSave: () => {},
  });

  // Load songs and initial data from Cloud SQL PostgreSQL
  useEffect(() => {
    // 1. Fetch songs from Cloud SQL
    fetch('/api/songs')
      .then((res) => res.json())
      .then((dbSongs) => {
        if (Array.isArray(dbSongs) && dbSongs.length > 0) {
          const mapped: SongItem[] = dbSongs.map((s) => ({
            id: `db-${s.id}`,
            title: s.title,
            artist: s.artist,
            url: s.url,
            type: (s.type as any) || 'local',
            duration: s.duration || 'MP3',
          }));
          setSongs((prev) => {
            const existingUrls = new Set(prev.map((p) => p.url));
            const newOnes = mapped.filter((m) => !existingUrls.has(m.url));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(() => {});

    // 2. Fetch book data from Cloud SQL
    fetch('/api/book-data')
      .then((res) => res.json())
      .then((sqlBook) => {
        if (sqlBook && sqlBook.title && sqlBook.initialized !== false) {
          setData((prev) => ({ ...prev, ...sqlBook }));
        }
      })
      .catch(() => {});
  }, []);

  // REALTIME FIREBASE SUBSCRIPTION:
  // Cualquier cambio hecho desde cualquier dispositivo o navegador se actualiza en vivo
  useEffect(() => {
    const unsubscribe = subscribeToScrapbook(
      (cloudData) => {
        setData(cloudData);
        setCloudSynced(true);
        setSyncStatusText('PostgreSQL & Firebase ✓');
        try {
          localStorage.setItem('scrapbook_500_data', JSON.stringify(cloudData));
        } catch {
          // ignore
        }
      },
      (err) => {
        console.warn('Firebase sync offline or local fallback:', err);
        setCloudSynced(false);
        setSyncStatusText('Modo local guardado');
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle music toggle
  const toggleMusic = () => {
    if (isPlayingMusic) {
      romanticAudio.stop();
      setIsPlayingMusic(false);
    } else {
      romanticAudio.start();
      setIsPlayingMusic(true);
    }
  };

  const handleUpdateSongs = (newSongs: SongItem[]) => {
    setSongs(newSongs);
    updateData({
      // sync to store if needed
    });
  };

  const triggerRain = () => {
    setRainTrigger((prev) => prev + 1);
  };

  const openEdit = (
    title: string,
    value: string,
    type: 'image' | 'text' | 'textarea',
    onSave: (val: string) => void
  ) => {
    setEditModal({
      isOpen: true,
      title,
      value,
      type,
      onSave,
    });
  };

  // Función unificada que actualiza en tiempo real en PostgreSQL (Cloud SQL) y Firebase Firestore
  const updateData = async (partial: Partial<ScrapbookStore>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setSyncStatusText('Guardando en la nube...');
    try {
      localStorage.setItem('scrapbook_500_data', JSON.stringify({ ...data, ...partial }));
    } catch {
      // ignore
    }

    // Guardar en Cloud SQL PostgreSQL
    fetch('/api/book-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, ...partial }),
    }).catch((err) => console.warn('Cloud SQL save warning:', err));

    // Guardar en Firebase Firestore
    try {
      await saveScrapbookToCloud(partial);
      setCloudSynced(true);
      setSyncStatusText('PostgreSQL & Firebase ✓');
    } catch (err) {
      console.error('Error al guardar en Firebase:', err);
      setCloudSynced(false);
      setSyncStatusText('Guardado localmente');
    }
  };

  // Dragging movable moon
  const handleMoonMouseDown = () => {
    setIsDraggingMoon(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMoon) return;
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setMoonPos({
        x: Math.max(5, Math.min(95, xPercent)),
        y: Math.max(5, Math.min(85, yPercent)),
      });
    };

    const handleMouseUp = () => {
      setIsDraggingMoon(false);
    };

    if (isDraggingMoon) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingMoon]);

  const currentChapter = CHAPTERS[currentSpread] || CHAPTERS[0];

  return (
    <div className="cosmic-night-bg min-h-screen text-slate-800 relative selection:bg-rose-500 selection:text-white pb-20">
      {/* 100% Golden Crispy Empanadas Rain with floating message */}
      <EmpanadaRain triggerKey={rainTrigger} showTextInitially={true} />

      {/* Movable Glowing Celestial Moon */}
      <div
        onMouseDown={handleMoonMouseDown}
        style={{ left: `${moonPos.x}%`, top: `${moonPos.y}%` }}
        className="fixed z-20 cursor-grab active:cursor-grabbing -translate-x-1/2 -translate-y-1/2 select-none group"
        title="¡Haz clic y arrastra la luna por la pantalla!"
      >
        <div className="relative">
          {/* Luminous moon halo */}
          <div className="absolute inset-0 rounded-full bg-amber-200/25 blur-xl animate-pulse" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-white shadow-[0_0_35px_rgba(254,240,138,0.7)] flex items-center justify-center border-2 border-amber-200/80 group-hover:scale-110 transition duration-300">
            {/* Moon craters detail */}
            <div className="w-3.5 h-3.5 rounded-full bg-amber-200/40 absolute top-3 left-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-200/30 absolute bottom-4 right-5" />
            <div className="w-4 h-4 rounded-full bg-amber-200/20 absolute bottom-3 left-6" />
            <span className="text-xl sm:text-2xl drop-shadow">🌙</span>
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-[9px] text-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition font-mono">
            Arrastra la luna
          </div>
        </div>
      </div>

      {/* ================= TOP GLOSSY HEADER BAR ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/75 border-b border-sky-400/20 px-3 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left badge & cute bears motif */}
          <div className="flex items-center gap-3">
            {/* Animated kissing/hugging teddy bears icon */}
            <div
              onClick={triggerRain}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-sky-400 via-rose-300 to-amber-300 shadow-md cursor-pointer hover:scale-105 transition"
              title="¡Clic para lluvia de empanadas!"
            >
              <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWpNdSVuq0o2aqmGVipejmexaZ2mzZQLDDGcx3TstkTJ15fIkH-mKV1mnzMueFoVwX2mWpDEU2s4mMg2ITcwEIQlyNTE8CZW4R5PbvNIlcqbjMHbP3hheC3zLB5WEIWL0cWb5BgtrTqQsgHvrTQm9MHKBaSsGZr891UYX5qcbUTpgoUakfSRHkJaKQCGqz_iWkGMtpzsIAAcnZY0xCtSE3rU05ExonrqbZ6rUQV1IoZwRCYoU8aZ5G0fh-AgAlbpZBoA"
                  alt="Ositos enamorados"
                  className="w-full h-full object-cover rounded-full animate-bears"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fancy text-lg sm:text-xl font-bold text-white tracking-wide">
                  Nuestro Scrapbook
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  500 Páginas
                </span>
                {/* Cloud indicator badge */}
                <span
                  title={syncStatusText}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border transition ${
                    cloudSynced
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cloudSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <Cloud className="w-3 h-3" />
                  <span className="hidden md:inline">{syncStatusText}</span>
                </span>
              </div>
              <p className="text-[11px] text-sky-200/80 font-hand text-sm truncate max-w-[200px] sm:max-w-xs">
                Para el osito más lindo: <span className="font-bold text-amber-300">{data.recipientName}</span>
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lluvia de Empanadas Button */}
            <button
              onClick={triggerRain}
              className="crystal-btn px-3 sm:px-4 py-1.5 sm:py-2 text-sky-950 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <span className="text-base sm:text-lg">🥟</span>
              <span className="hidden md:inline">Lluvia de Empanadas</span>
              <span className="text-[9px] bg-amber-400/80 text-amber-950 px-1 rounded-full font-bold">
                CRISPY
              </span>
            </button>

            {/* Music Button with spinning record icon */}
            <button
              onClick={toggleMusic}
              className={`px-3 py-1.5 sm:py-2 text-xs font-bold rounded-full flex items-center gap-1.5 border transition ${
                isPlayingMusic
                  ? 'bg-rose-500/90 text-white border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-white/10 text-sky-200 border-white/20 hover:bg-white/20'
              }`}
            >
              <Disc className={`w-4 h-4 ${isPlayingMusic ? 'spin-record' : ''}`} />
              <span className="hidden sm:inline">
                {isPlayingMusic ? 'Música Activa' : 'Música'}
              </span>
            </button>

            {/* Admin Settings Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-sky-200 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition"
              title="Panel de Administración"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Admin</span>
            </button>
          </div>
        </div>

        {/* Chapter Navigation Pills (Horizontal Bar) */}
        <div className="max-w-7xl mx-auto mt-2 overflow-x-auto custom-scroll pb-1">
          <div className="flex items-center gap-2 min-w-max">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setCurrentSpread(ch.id)}
                className={`spread-pill-btn px-3 py-1 text-xs rounded-full border transition whitespace-nowrap ${
                  currentSpread === ch.id
                    ? 'active bg-gradient-to-r from-sky-400 to-blue-500 text-sky-950 font-bold border-sky-300 shadow-md'
                    : 'bg-white/10 text-sky-200/90 hover:bg-white/20 border-white/10'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ================= MAIN BOOK CONTAINER ================= */}
      <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pt-6 sm:pt-8">
        {/* Book Frame with realism, metal rings and shadow */}
        <div className="relative bg-[#ebe4d5] p-2 sm:p-4 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#3e4c5f]/40">
          {/* Metal Spiral Rings Top / Center Gutter */}
          <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-30 flex-col justify-around pointer-events-none py-6">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-2.5 rounded-full book-ring shadow-md border border-slate-700/60"
              />
            ))}
          </div>

          {/* Book Spine Center Shadow overlay */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 spine-gutter z-20 pointer-events-none" />

          {/* Book Pages Container */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl relative">
            {currentSpread === 0 && (
              <SpreadCover
                data={data}
                onOpenEdit={openEdit}
                onOpenLetter={() => setIsLetterOpen(true)}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 1 && (
              <SpreadSpecialMoments
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 2 && (
              <SpreadMusicAndGames
                data={data}
                isPlayingMusic={isPlayingMusic}
                onToggleMusic={toggleMusic}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 3 && (
              <SpreadHeartMosaic
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
              />
            )}
            {currentSpread === 4 && (
              <SpreadSocialFeed
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 5 && (
              <SpreadTinAndDenim
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 6 && (
              <SpreadAchievements
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 7 && (
              <SpreadThingsWeLove
                data={data}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
            {currentSpread === 8 && (
              <SpreadVinylAndTenThings
                data={data}
                isPlayingMusic={isPlayingMusic}
                onToggleMusic={toggleMusic}
                onOpenEdit={openEdit}
                onTriggerRain={triggerRain}
                onUpdateData={updateData}
              />
            )}
          </div>
        </div>

        {/* ================= BOTTOM NAVIGATION BAR ================= */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 glass-pill p-3 sm:p-4 rounded-2xl shadow-xl border border-sky-300/40">
          {/* Previous Page Button */}
          <button
            onClick={() => setCurrentSpread((prev) => Math.max(0, prev - 1))}
            disabled={currentSpread === 0}
            className={`crystal-btn px-4 sm:px-6 py-2 rounded-xl text-xs font-bold text-sky-950 flex items-center gap-1.5 ${
              currentSpread === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Página Anterior
          </button>

          {/* Progress Indicator */}
          <div className="text-center">
            <div className="font-sans-ui font-extrabold text-xs sm:text-sm text-sky-950 tracking-wider">
              PÁGINAS {currentChapter.pageStart} - {currentChapter.pageEnd} DE 500 PÁGINAS
            </div>
            <div className="w-44 sm:w-56 h-2 bg-sky-200/60 rounded-full mx-auto mt-1.5 overflow-hidden p-0.5 border border-sky-300">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-rose-400 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSpread + 1) / CHAPTERS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => setCurrentSpread((prev) => Math.min(CHAPTERS.length - 1, prev + 1))}
            disabled={currentSpread === CHAPTERS.length - 1}
            className={`crystal-btn px-4 sm:px-6 py-2 rounded-xl text-xs font-bold text-sky-950 flex items-center gap-1.5 ${
              currentSpread === CHAPTERS.length - 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Siguiente Página
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Interactive Music Player with MP3 upload, Spotify, YouTube and Cloud SQL persistence */}
      <MusicPlayer
        songs={songs}
        onUpdateSongs={handleUpdateSongs}
        isAdmin={true}
      />

      {/* Modals */}
      <EditItemModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title={editModal.title}
        currentValue={editModal.value}
        type={editModal.type}
        onSave={editModal.onSave}
      />

      <SecretLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        recipientName={data.recipientName}
        senderName={data.senderName}
        letterContent={data.secretLetter}
        onSaveContent={(val) => updateData({ secretLetter: val })}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onSave={(newData) => updateData(newData)}
      />
    </div>
  );
}
