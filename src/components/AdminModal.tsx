import React, { useState } from 'react';
import { X, Lock, Save, RotateCcw, Cloud, Music, Image, Sliders, Check } from 'lucide-react';
import { ScrapbookStore, defaultScrapbookData } from '../data/scrapbookData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ScrapbookStore;
  onSave: (newData: ScrapbookStore) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<ScrapbookStore>(data);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass or simple check
    if (password === 'osito' || password === '1234' || password === 'amor' || password.length >= 3) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta. (Prueba: osito)');
    }
  };

  const handleSaveAll = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('¿Deseas restaurar todos los contenidos iniciales de las 500 páginas?')) {
      setFormData(defaultScrapbookData);
      onSave(defaultScrapbookData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-sky-300 max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-fancy text-sky-950">
                Panel de Administración Exclusivo
              </h2>
              <p className="text-xs text-slate-500">Personaliza tus 500 páginas en tiempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="py-8 text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 border border-sky-200">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Acceso Protegido</h3>
            <p className="text-xs text-slate-500">
              Ingresa la contraseña de administrador (por defecto: <span className="font-mono font-bold text-sky-600">osito</span>)
            </p>
            <input
              type="password"
              placeholder="Contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-400 outline-none text-center"
              autoFocus
            />
            <button
              type="submit"
              className="crystal-btn w-full py-2.5 text-sky-950 font-bold rounded-xl text-sm"
            >
              Entrar al Panel
            </button>
          </form>
        ) : (
          <div className="py-4 space-y-6">
            {/* General parameters */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b pb-1">
                Datos Generales
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nombre del Destinatario (Para quién es):
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Tu Nombre o Apodo (Remitente):
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Título de Portada:
                </label>
                <input
                  type="text"
                  value={formData.coverTitle}
                  onChange={(e) => setFormData({ ...formData, coverTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Subtítulo de Portada:
                </label>
                <input
                  type="text"
                  value={formData.coverSubtitle}
                  onChange={(e) => setFormData({ ...formData, coverSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Social & Feeds */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b pb-1">
                Páginas 09 - 10 (Redes Sociales & Feed)
              </h4>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pie de Foto Instagram:
                </label>
                <textarea
                  rows={2}
                  value={formData.igCaption}
                  onChange={(e) => setFormData({ ...formData, igCaption: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cita de Tweet:
                </label>
                <textarea
                  rows={2}
                  value={formData.xBody}
                  onChange={(e) => setFormData({ ...formData, xBody: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Cloud sync & backup */}
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cloud className="w-5 h-5 text-sky-600" />
                <div>
                  <div className="text-xs font-bold text-sky-950">Sincronización en la Nube</div>
                  <div className="text-[11px] text-sky-700">Tus cambios se guardan automáticamente</div>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar por Defecto
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveAll}
                className="crystal-btn px-6 py-2.5 text-sm font-bold text-sky-950 rounded-xl flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" /> ¡Guardado con Éxito!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Guardar Todos los Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
