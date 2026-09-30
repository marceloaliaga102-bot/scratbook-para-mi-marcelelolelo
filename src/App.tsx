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
  Lock,
  Unlock,
  LogOut,
  Pencil,
  Share2
} from 'lucide-react';
import { ScrapbookStore, defaultScrapbookData } from './data/scrapbookData';
import { EmpanadaRain } from './components/EmpanadaRain';
import { EditItemModal } from './components/EditItemModal';
import { SecretLetterModal } from './components/SecretLetterModal';
import { AdminModal } from './components/AdminModal';
import { MusicPlayer } from './components/MusicPlayer';
import { BookCoverIntro } from './components/BookCoverIntro';
import { DynamicPageSpread } from './components/DynamicPageSpread';
import { ShareModal } from './components/ShareModal';
import { romanticAudio } from './utils/romanticAudio';
import { subscribeToScrapbook, saveScrapbookToCloud } from './firebase';
import { SongItem, CustomPage } from './types';

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

const CORE_CHAPTERS = [
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

const TOTAL_PAGES = 500;
const TOTAL_SPREADS = 250; // 500 pages / 2

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

  const [currentSpread, setCurrentSpread] = useState(0); // Start on Page 1-2
  const [isBookOpened, setIsBookOpened] = useState(false); // Closed cover intro screen
  const [rainTrigger, setRainTrigger] = useState(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(true);
  const [syncStatusText, setSyncStatusText] = useState<string>('Conectado en la nube');
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Playlist state with uploaded & custom songs, initialized from stored data
  const [songs, setSongs] = useState<SongItem[]>(() => {
    try {
      const local = localStorage.getItem('scrapbook_500_data');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed.songs)) {
          return parsed.songs;
        }
      }
    } catch {}
    return defaultScrapbookData.songs || [];
  });

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

  // Initial load from backend
  useEffect(() => {
    // 1. Fetch songs from backend
    fetch('/api/songs')
      .then((res) => res.json())
      .then((dbSongs) => {
        if (Array.isArray(dbSongs) && dbSongs.length > 0) {
          setSongs((prev) => {
            if (prev.length === 0) {
              return dbSongs.map((s) => ({
                id: `db-${s.id}`,
                title: s.title,
                artist: s.artist,
                url: s.url,
                type: (s.type as any) || 'local',
                duration: s.duration || 'MP3',
              }));
            }
            return prev;
          });
        }
      })
      .catch(() => {});

    // 2. Fetch book data from backend
    fetch('/api/book-data')
      .then((res) => res.json())
      .then((sqlBook) => {
        if (sqlBook && sqlBook.initialized !== false) {
          setData((prev) => {
            const mergedCustomPages = {
              ...(prev.customPages || {}),
              ...(sqlBook.customPages || {}),
            };
            const next = {
              ...prev,
              ...sqlBook,
              customPages: mergedCustomPages,
            };
            try {
              localStorage.setItem('scrapbook_500_data', JSON.stringify(next));
            } catch {}
            return next;
          });
          if (Array.isArray(sqlBook.songs) && sqlBook.songs.length > 0) {
            setSongs(sqlBook.songs);
          }
        }
      })
      .catch(() => {});
  }, []);

  // REALTIME FIREBASE SUBSCRIPTION:
  // Cualquier cambio en Firebase Firestore se sincroniza en vivo en todos los dispositivos
  useEffect(() => {
    const unsubscribe = subscribeToScrapbook(
      (cloudData) => {
        setData((prev) => {
          // Combinar profundamente las páginas para no perder fotos añadidas localmente
          const mergedCustomPages = {
            ...(prev.customPages || {}),
            ...(cloudData.customPages || {}),
          };
          const next = {
            ...prev,
            ...cloudData,
            customPages: mergedCustomPages,
          };
          try {
            localStorage.setItem('scrapbook_500_data', JSON.stringify(next));
          } catch {}
          return next;
        });

        if (Array.isArray(cloudData.songs)) {
          setSongs(cloudData.songs);
        }
        setCloudSynced(true);
        setSyncStatusText('Firebase & PostgreSQL ✓');
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
      setIsPlayingMusic(true);
      if (songs[0]?.type === 'synth') {
        romanticAudio.start();
      }
    }
  };

  const handleUpdateSongs = (newSongs: SongItem[]) => {
    setSongs(newSongs);
    updateData({
      songs: newSongs,
    });
  };

  const triggerRain = () => {
    setRainTrigger((prev) => prev + 1);
  };

  // Only open edit modal if admin is authenticated!
  const openEdit = (
    title: string,
    value: string,
    type: 'image' | 'text' | 'textarea',
    onSave: (val: string) => void
  ) => {
    if (!isAdminLoggedIn) {
      // Normal visitors cannot edit: invite to login or ignore
      return;
    }
    setEditModal({
      isOpen: true,
      title,
      value,
      type,
      onSave,
    });
  };

  // Función unificada que actualiza en tiempo real en Firestore, PostgreSQL y localStorage
  // Admite tanto un objeto parcial como una función updater (prevStore => partial)
  const updateData = async (
    updaterOrPartial: Partial<ScrapbookStore> | ((prev: ScrapbookStore) => Partial<ScrapbookStore>)
  ) => {
    let payloadToSave: Partial<ScrapbookStore> = {};
    let fullUpdatedState: ScrapbookStore = data;

    // 1. Actualización optimista instantánea (0ms de retraso)
    setData((prev) => {
      const partial = typeof updaterOrPartial === 'function' ? updaterOrPartial(prev) : updaterOrPartial;
      payloadToSave = partial;

      const mergedCustomPages = partial.customPages
        ? { ...(prev.customPages || {}), ...partial.customPages }
        : prev.customPages;

      fullUpdatedState = {
        ...prev,
        ...partial,
        customPages: mergedCustomPages,
      };

      try {
        localStorage.setItem('scrapbook_500_data', JSON.stringify(fullUpdatedState));
      } catch (e) {
        console.warn('LocalStorage save notice:', e);
      }
      return fullUpdatedState;
    });

    setSyncStatusText('Guardando...');

    const savePayload: Partial<ScrapbookStore> = {
      ...payloadToSave,
      customPages: fullUpdatedState.customPages,
    };

    // 2. Guardar en paralelo en PostgreSQL (Cloud SQL) y Firebase Firestore
    const sqlPromise = fetch('/api/book-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savePayload),
    }).catch((err) => console.warn('Cloud SQL save notice:', err));

    const firestorePromise = saveScrapbookToCloud(savePayload)
      .then(() => {
        setCloudSynced(true);
        setSyncStatusText('Firebase & PostgreSQL ✓');
      })
      .catch((err) => {
        console.error('Error al guardar en Firebase:', err);
        setCloudSynced(false);
        setSyncStatusText('Guardado localmente');
      });

    await Promise.allSettled([sqlPromise, firestorePromise]);
  };

  // Jump to specific page
  const handleJumpToPage = (pageNum: number) => {
    const validPage = Math.max(1, Math.min(TOTAL_PAGES, pageNum));
    const targetSpread = Math.floor((validPage - 1) / 2);
    setCurrentSpread(targetSpread);
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
        y: Math.max(5, Math.min(95, yPercent)),
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

  // Current page numbers
  const currentLeftPage = currentSpread * 2 + 1;
  const currentRightPage = currentSpread * 2 + 2;
  const currentChapter = CORE_CHAPTERS.find((c) => c.id === currentSpread);

  return (
    <div className="cosmic-night-bg min-h-screen text-slate-800 relative selection:bg-rose-500 selection:text-white pb-24">
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
          <div className="absolute inset-0 rounded-full bg-amber-200/25 blur-xl animate-pulse" />
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-white shadow-[0_0_35px_rgba(254,240,138,0.7)] flex items-center justify-center border-2 border-amber-200/80 group-hover:scale-110 transition duration-300">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-200/40 absolute top-3 left-4" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-200/30 absolute bottom-4 right-5" />
            <span className="text-xl sm:text-2xl drop-shadow">🌙</span>
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-[9px] text-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition font-mono">
            Arrastra la luna
          </div>
        </div>
      </div>

      {/* ================= TOP GLOSSY HEADER BAR ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-sky-400/20 px-3 sm:px-6 py-2 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Left badge & bears motif */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              onClick={triggerRain}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-sky-400 via-rose-300 to-amber-300 shadow-md cursor-pointer hover:scale-105 transition"
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
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-fancy text-base sm:text-xl font-bold text-white tracking-wide">
                  Nuestro Scrapbook
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  500 Páginas
                </span>
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
              <p className="text-[11px] text-sky-200/80 font-hand text-sm truncate max-w-[170px] sm:max-w-xs">
                Para: <span className="font-bold text-amber-300">{data.recipientName}</span>
              </p>
            </div>
          </div>

          {/* Right Action buttons (Never blocked by music player now) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Lluvia de Empanadas Button */}
            <button
              onClick={triggerRain}
              className="crystal-btn px-2.5 sm:px-4 py-1.5 sm:py-2 text-sky-950 font-bold text-xs rounded-full flex items-center gap-1 shadow-lg active:scale-95"
            >
              <span className="text-base sm:text-lg">🥟</span>
              <span className="hidden md:inline">Empanadas</span>
            </button>

            {/* Close / Return to Cover Button */}
            <button
              onClick={() => setIsBookOpened(false)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/30 text-xs font-bold flex items-center gap-1.5 transition shadow"
              title="Cerrar el libro y volver a la portada interactiva"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Cerrar Libro</span>
            </button>

            {/* Admin Button with Login indicator */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3 py-1.5 sm:py-2 rounded-full bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/50 text-xs font-bold flex items-center gap-1.5 shadow"
                title="Modo Editor Activo - Clic para abrir panel de control"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Editor Activo</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-sky-200 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition"
                title="Iniciar Sesión de Administrador para editar textos"
              >
                <Lock className="w-3.5 h-3.5 text-sky-300" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            <button
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 sm:py-2 rounded-full bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 border border-rose-400/50 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Compartir enlace para celular con Marcelololelo"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>

        {/* Chapter Navigation Pills (Horizontal Bar) */}
        <div className="max-w-7xl mx-auto mt-2 overflow-x-auto custom-scroll pb-1 flex items-center gap-2">
          {CORE_CHAPTERS.map((ch) => (
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

          {/* Dynamic pill for pages 25 to 500 */}
          {currentSpread >= CORE_CHAPTERS.length && (
            <div className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-rose-400 to-amber-400 text-rose-950 font-bold border border-rose-300 shadow-md whitespace-nowrap">
              ✨ Págs {currentLeftPage}-{currentRightPage} de 500
            </div>
          )}
        </div>
      </header>

      {/* Admin Mode Floating Notice */}
      {isAdminLoggedIn && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs font-bold px-4 py-1.5 text-center shadow flex items-center justify-center gap-2">
          <Pencil className="w-3.5 h-3.5" />
          <span>Modo Editor Activo: Haz clic en cualquier texto, foto o página para modificarlo</span>
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="ml-3 px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[10px] uppercase font-mono tracking-wider"
          >
            Salir
          </button>
        </div>
      )}

      {/* ================= MAIN BOOK CONTAINER ================= */}
      <main className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pt-4 sm:pt-6">
        {/* Book Frame with realism, metal rings and shadow */}
        <div className="relative bg-[#ebe4d5] p-2 sm:p-4 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#3e4c5f]/40">
          {/* Metal Spiral Rings Center Gutter */}
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
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl relative min-h-[720px]">
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
                onPauseBackgroundMusic={() => {
                  if (isPlayingMusic) {
                    toggleMusic();
                  }
                }}
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
                onUpdateData={updateData}
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

            {/* Dynamic Customizable Spreads for Pages 25 through 500 */}
            {currentSpread >= 9 && (
              <DynamicPageSpread
                spreadIndex={currentSpread}
                leftPageNumber={currentLeftPage}
                rightPageNumber={currentRightPage}
                leftPageData={data.customPages?.[currentLeftPage]}
                rightPageData={data.customPages?.[currentRightPage]}
                isAdmin={isAdminLoggedIn}
                onUpdatePage={(pageNum, pageOrUpdater) => {
                  updateData((prevStore) => {
                    const existingPage: CustomPage = prevStore.customPages?.[pageNum] || {
                      pageNumber: pageNum,
                      title: `Página ${pageNum}`,
                      subtitle: 'Nuestra Historia',
                      elements: [],
                    };
                    const updatedPage =
                      typeof pageOrUpdater === 'function' ? pageOrUpdater(existingPage) : pageOrUpdater;

                    return {
                      customPages: {
                        ...(prevStore.customPages || {}),
                        [pageNum]: updatedPage,
                      },
                    };
                  });
                }}
                onOpenEdit={openEdit}
              />
            )}
          </div>
        </div>

        {/* ================= BOTTOM NAVIGATION BAR ================= */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 glass-pill p-3 sm:p-4 rounded-2xl shadow-xl border border-sky-300/40">
          {/* Previous Page Button */}
          <button
            onClick={() => setCurrentSpread((prev) => Math.max(0, prev - 1))}
            disabled={currentSpread === 0}
            className={`crystal-btn px-4 sm:px-6 py-2 rounded-xl text-xs font-bold text-sky-950 flex items-center gap-1.5 ${
              currentSpread === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Página Anterior</span>
          </button>

          {/* Progress & Quick Page Jumper */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
            <div>
              <div className="font-sans-ui font-extrabold text-xs sm:text-sm text-sky-950 tracking-wider">
                PÁGINAS {currentLeftPage} - {currentRightPage} DE {TOTAL_PAGES}
              </div>
              <div className="w-36 sm:w-48 h-2 bg-sky-200/60 rounded-full mx-auto mt-1 overflow-hidden p-0.5 border border-sky-300">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-rose-400 to-amber-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentSpread + 1) / TOTAL_SPREADS) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Quick jump to page */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const p = parseInt(jumpPageInput, 10);
                if (!isNaN(p)) {
                  handleJumpToPage(p);
                  setJumpPageInput('');
                }
              }}
              className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded-xl border border-sky-200"
            >
              <span className="text-[10px] font-bold text-slate-600">Ir a pág:</span>
              <input
                type="number"
                min={1}
                max={TOTAL_PAGES}
                placeholder="Ej: 25"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-14 px-1.5 py-0.5 text-xs text-center font-bold bg-white rounded border border-slate-300 outline-none"
              />
              <button
                type="submit"
                className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold"
              >
                Ir
              </button>
            </form>
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => setCurrentSpread((prev) => Math.min(TOTAL_SPREADS - 1, prev + 1))}
            disabled={currentSpread === TOTAL_SPREADS - 1}
            className={`crystal-btn px-4 sm:px-6 py-2 rounded-xl text-xs font-bold text-sky-950 flex items-center gap-1.5 ${
              currentSpread === TOTAL_SPREADS - 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>Siguiente Página</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Pre-book Intro Screen (Portada Cerrada de Lujo) */}
      {!isBookOpened && (
        <BookCoverIntro
          recipientName={data.recipientName}
          senderName={data.senderName}
          coverTitle={data.coverTitle}
          coverSubtitle={data.coverSubtitle}
          onOpenBook={() => {
            setIsBookOpened(true);
            setCurrentSpread(0);
            if (!isPlayingMusic) {
              romanticAudio.start();
              setIsPlayingMusic(true);
            }
          }}
          onTriggerRain={triggerRain}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenEdit={openEdit}
          onUpdateCover={(partial) => updateData(partial)}
          onOpenShare={() => setIsShareOpen(true)}
        />
      )}

      {/* Floating Music Player (Positioned at bottom-right, minimizable, never overlaps header or admin) */}
      <MusicPlayer
        songs={songs}
        onUpdateSongs={handleUpdateSongs}
        isAdmin={isAdminLoggedIn}
        isPlaying={isPlayingMusic}
        onPlayChange={(val) => setIsPlayingMusic(val)}
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
        letterContent={data.secretLetter}
        recipientName={data.recipientName}
        senderName={data.senderName}
        onSaveContent={(newLetter: string) => updateData({ secretLetter: newLetter })}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onSave={(newData) => updateData(newData)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setIsAdminOpen(false);
        }}
        onJumpToPage={handleJumpToPage}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        recipientName={data.recipientName}
      />
    </div>
  );
}
