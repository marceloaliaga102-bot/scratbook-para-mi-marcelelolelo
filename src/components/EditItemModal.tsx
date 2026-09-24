import React, { useState } from 'react';
import { X, Upload, Link, Check } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setValue(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-sky-200">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <h3 className="text-xl font-bold font-fancy text-sky-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {type === 'image' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Enlace directo (URL de imagen):
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-sky-400">
                  <Link className="w-4 h-4 text-sky-600 shrink-0" />
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="w-full text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  O subir desde tu computadora o celular:
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-300 rounded-xl p-4 cursor-pointer hover:bg-sky-50/50 transition">
                  <Upload className="w-6 h-6 text-sky-500 mb-1" />
                  <span className="text-xs text-sky-700 font-medium">Seleccionar foto local</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {value && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Vista previa:</span>
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    <img
                      src={value}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : type === 'textarea' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Escribe tu texto o dedicatoria:
              </label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none"
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
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-sky-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="crystal-btn px-5 py-2 text-sky-900 text-sm font-bold rounded-lg flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
