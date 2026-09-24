import React, { useState, useEffect } from 'react';
import { X, Upload, Link, Check, Film, Image as ImageIcon } from 'lucide-react';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string;
  type: 'image' | 'text' | 'textarea';
  onSave: (newValue: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  title,
  currentValue,
  type,
  onSave,
}) => {
  const [value, setValue] = useState(currentValue);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    setValue(currentValue);
    // Auto-detect video
    if (
      currentValue?.endsWith('.mp4') ||
      currentValue?.endsWith('.webm') ||
      currentValue?.startsWith('data:video') ||
      currentValue?.includes('youtube.com') ||
      currentValue?.includes('youtu.be')
    ) {
      setMediaType('video');
    } else {
      setMediaType('image');
    }
  }, [currentValue, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }

      // Check file size (limit dataURLs to reasonable size < 8MB for smooth Firebase sync)
      if (file.size > 10 * 1024 * 1024) {
        alert('Para videos o fotos muy pesadas (+10MB), te recomendamos usar un enlace directo o comprimir el archivo.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setValue(dataUrl);
          // Persist media to Cloud SQL PostgreSQL database
          fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              url: dataUrl,
              caption: title,
              size: file.size,
            }),
          }).catch((err) => console.warn('Cloud SQL media upload warning:', err));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // If URL input was used for image/video, also record to media library
    if (type === 'image' && value) {
      fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title || 'Multimedia Scrapbook',
          type: isVideo ? 'video' : 'image',
          url: value,
          caption: title,
        }),
      }).catch(() => {});
    }
    onSave(value);
    onClose();
  };

  const isVideo =
    mediaType === 'video' ||
    value.startsWith('data:video') ||
    value.endsWith('.mp4') ||
    value.endsWith('.webm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-sky-300">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div>
            <h3 className="text-xl font-bold font-fancy text-sky-950">{title}</h3>
            <p className="text-[11px] text-sky-600 font-medium">
              Sincronizado en la nube (PostgreSQL Cloud SQL & Firebase)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {type === 'image' ? (
            <div className="space-y-4">
              {/* Media type picker */}
              <div className="flex items-center gap-2 p-1 bg-sky-50 rounded-xl border border-sky-200">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    mediaType === 'image'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Foto / Imagen
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    mediaType === 'video'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  Video / Clip
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Enlace directo (URL de {mediaType === 'video' ? 'video' : 'foto'}):
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-xl p-2.5 bg-slate-50/50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:bg-white">
                  <Link className="w-4 h-4 text-sky-600 shrink-0" />
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={
                      mediaType === 'video'
                        ? 'https://.../video.mp4'
                        : 'https://.../foto.jpg'
                    }
                    className="w-full text-xs sm:text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  O subir archivo desde tu celular o computadora:
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl p-4 cursor-pointer bg-sky-50/40 hover:bg-sky-50 transition group">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-1.5 group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-sky-800 font-bold">
                    Subir {mediaType === 'video' ? 'video (.mp4, .mov, etc.)' : 'foto (.jpg, .png, etc.)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Se guarda directamente en la nube
                  </span>
                  <input
                    type="file"
                    accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {value && (
                <div>
                  <span className="text-xs font-semibold text-slate-600 block mb-1">
                    Vista previa de lo que verá tu pareja:
                  </span>
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center shadow-inner relative">
                    {isVideo ? (
                      <video
                        src={value}
                        controls
                        autoPlay
                        loop
                        muted
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <img
                        src={value}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : type === 'textarea' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Escribe tu dedicatoria o mensaje de amor:
              </label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none bg-slate-50/50 focus:bg-white"
                placeholder="Escribe lo que sientes en tu corazón..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Editar texto:
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none bg-slate-50/50 focus:bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-sky-100">
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Nube Firebase lista
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="crystal-btn px-5 py-2 text-sky-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              Guardar en la Nube
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
