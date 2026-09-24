import React, { useState } from 'react';
import { X, Heart, Edit3, Check } from 'lucide-react';

interface SecretLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  letterContent: string;
  onSaveContent: (newContent: string) => void;
}

export const SecretLetterModal: React.FC<SecretLetterModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName,
  letterContent,
  onSaveContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(letterContent);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#fcf9f2] text-slate-800 rounded-2xl max-w-xl w-full p-8 shadow-2xl border-4 border-[#e6dbc8] overflow-hidden">
        {/* Background parchment texture */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-repeating-linear-gradient-to-r from-red-400 via-white to-blue-400 opacity-70" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-500 hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-500 mb-2 shadow-inner">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <h2 className="font-fancy text-3xl text-rose-950 font-bold">
            Carta Íntima • De Mi Corazón al Tuyo
          </h2>
          <p className="font-hand text-xl text-rose-700">Para mi amado {recipientName}</p>
        </div>

        <div className="bg-white/80 p-6 rounded-xl border border-[#ebdcc3] shadow-inner mb-6 relative">
          {isEditing ? (
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-base font-hand text-slate-800 leading-relaxed outline-none bg-transparent"
            />
          ) : (
            <p className="font-hand text-2xl text-slate-800 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          )}

          <div className="text-right mt-6 font-hand text-xl text-rose-900 font-bold">
            Con todo mi amor infinito,
            <div className="font-fancy text-2xl text-rose-600">{senderName}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (isEditing) {
                onSaveContent(content);
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 px-4 py-2 rounded-lg border border-rose-200"
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Guardar Carta
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" /> Editar mi Carta
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="crystal-btn px-6 py-2 text-sm font-bold text-sky-950 rounded-lg"
          >
            Cerrar y Guardar en el Sobre
          </button>
        </div>
      </div>
    </div>
  );
};
