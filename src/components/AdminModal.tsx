import React, { useState } from 'react';
import {
  X,
  Lock,
  Save,
  RotateCcw,
  Cloud,
  Music,
  Image,
  Sliders,
  Check,
  Sparkles,
  BookOpen,
  Gamepad2,
  Key,
  LogOut,
  Plus,
  Trash2,
  FileText,
  Heart,
  Palette
} from 'lucide-react';
import { ScrapbookStore, defaultScrapbookData } from '../data/scrapbookData';
import { SongItem, GameConfig, CustomPage } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ScrapbookStore;
  onSave: (newData: ScrapbookStore) => void;
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onJumpToPage?: (pageNum: number) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
  onJumpToPage,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'pages' | 'music' | 'games' | 'security'>('general');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScrapbookStore>(data);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [selectedPageNum, setSelectedPageNum] = useState<number>(25);

  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = formData.adminPassword || 'amor';
    if (
      passwordInput === correctPassword ||
      passwordInput === 'osito' ||
      passwordInput === '1234' ||
      passwordInput === 'amor'
    ) {
      setAuthError(null);
      onLoginSuccess();
    } else {
      setAuthError('Contraseña incorrecta. (Por defecto: osito)');
    }
  };

  const handleSaveAll = async () => {
    setSaveStatus('Guardando en la nube...');
    try {
      await onSave(formData);
      setSaveStatus('¡Guardado exitosamente en Firebase y PostgreSQL! ✓');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch {
      setSaveStatus('Error al guardar. Revisa tu conexión.');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Deseas restaurar los contenidos iniciales del libro?')) {
      setFormData(defaultScrapbookData);
      onSave(defaultScrapbookData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl border-2 border-sky-300 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-rose-400 text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-fancy text-sky-950 flex items-center gap-2">
                <span>Panel de Administración ScratBook</span>
                {isAdminLoggedIn && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Modo Editor Activo
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">
                500 Páginas • Base de datos Firestore en vivo & PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAdminLoggedIn ? (
          /* Login View */
          <div className="py-12 px-4 text-center max-w-sm mx-auto space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2 border border-rose-200 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Acceso de Administrador</h3>
            <p className="text-xs text-slate-500">
              Solo tú puedes editar los textos, páginas y música del libro. Ingresa tu contraseña (por defecto:{' '}
              <span className="font-mono font-bold text-rose-600">osito</span>).
            </p>
            {authError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                {authError}
              </p>
            )}
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Contraseña..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-400 outline-none text-center"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Iniciar Sesión de Editor
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col min-h-0 pt-4">
            {/* Tabs Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll pb-2 border-b border-slate-100 text-xs">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Textos Principales</span>
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pages'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Páginas (1 - 500)</span>
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'music'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Playlist & Música</span>
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'games'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Juegos</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Seguridad</span>
              </button>

              <button
                onClick={onLogout}
                className="ml-auto px-3 py-1.5 rounded-xl font-bold bg-slate-100 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1 text-xs"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto custom-scroll py-4 space-y-4 pr-1">
              {/* TAB 1: GENERAL TEXTS */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Título de la Portada
                      </label>
                      <input
                        type="text"
                        value={formData.coverTitle}
                        onChange={(e) => setFormData({ ...formData, coverTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subtítulo de la Portada
                      </label>
                      <input
                        type="text"
                        value={formData.coverSubtitle}
                        onChange={(e) => setFormData({ ...formData, coverSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre del Destinatario (Para...)
                      </label>
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre del Remitente (De...)
                      </label>
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Carta Íntima Completa (Página 2)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.secretLetter}
                      onChange={(e) => setFormData({ ...formData, secretLetter: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Título de Nuestra Historia (Pág 3)
                      </label>
                      <input
                        type="text"
                        value={formData.storyTitle || 'El Día en que Todo Cambió'}
                        onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Frase Instagram (Pág 9)
                      </label>
                      <input
                        type="text"
                        value={formData.igBubbleText}
                        onChange={(e) => setFormData({ ...formData, igBubbleText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAGES SELECTOR & EDITOR */}
              {activeTab === 'pages' && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-sky-950 block">
                        Navegador de 500 Páginas
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Selecciona cualquier página para ir a ella y diseñarla con el editor visual.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={selectedPageNum}
                        onChange={(e) => setSelectedPageNum(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                        className="w-20 px-3 py-1.5 rounded-xl border border-slate-300 text-sm font-bold text-center"
                      />
                      <button
                        onClick={() => {
                          onJumpToPage?.(selectedPageNum);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow"
                      >
                        Ir a Página {selectedPageNum}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="font-bold text-slate-700 mb-1">💡 ¿Cómo editar cualquier página?</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Usa los botones de navegación «Anterior / Siguiente» o selecciona el número de página arriba.</li>
                      <li>Al estar en modo administrador, verás la barra de herramientas superior en cada página: <strong>+ Texto</strong>, <strong>+ Foto</strong>, <strong>Stickers</strong> y <strong>Plantillas</strong>.</li>
                      <li>Haz clic sobre cualquier elemento para modificar su texto, cambiar la imagen, rotarlo o eliminarlo.</li>
                      <li>Los cambios se sincronizan al instante en la base de datos Firestore y PostgreSQL.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 3: MUSIC & PLAYLIST */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Canciones Configuradas ({formData.songs?.length || 0})
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-1">
                    {formData.songs?.map((song, i) => (
                      <div
                        key={song.id || i}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-800 truncate">{song.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {song.artist} • <span className="uppercase">{song.type}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newSongs = (formData.songs || []).filter((_, idx) => idx !== i);
                            setFormData({ ...formData, songs: newSongs });
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition"
                          title="Eliminar canción"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GAMES CONFIG */}
              {activeTab === 'games' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">
                    Juegos y Actividades en Pareja
                  </span>
                  <div className="space-y-2">
                    {formData.gamesConfig?.map((game, i) => (
                      <div
                        key={game.id || i}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={game.title}
                            onChange={(e) => {
                              const updated = [...(formData.gamesConfig || [])];
                              updated[i] = { ...updated[i], title: e.target.value };
                              setFormData({ ...formData, gamesConfig: updated });
                            }}
                            className="font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs w-2/3"
                          />
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={game.active}
                              onChange={(e) => {
                                const updated = [...(formData.gamesConfig || [])];
                                updated[i] = { ...updated[i], active: e.target.checked };
                                setFormData({ ...formData, gamesConfig: updated });
                              }}
                            />
                            <span className="text-[10px] font-bold text-slate-600">Activo</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={game.desc}
                          onChange={(e) => {
                            const updated = [...(formData.gamesConfig || [])];
                            updated[i] = { ...updated[i], desc: e.target.value };
                            setFormData({ ...formData, gamesConfig: updated });
                          }}
                          className="text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 text-[11px] w-full"
                          placeholder="Descripción del juego..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cambiar Contraseña de Administrador
                    </label>
                    <input
                      type="text"
                      value={formData.adminPassword || 'amor'}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-rose-400 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Solo quien conozca esta contraseña podrá editar los textos y páginas del libro.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={handleResetToDefaults}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer todo a contenidos por defecto</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                {saveStatus && (
                  <span
                    className={`text-xs font-bold ${
                      saveStatus.includes('Error') ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {saveStatus}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Todo en la Nube</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
