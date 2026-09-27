import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, MessageCircle, X, Heart, Globe, Sparkles, Download, GitBranch } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'vercel'>('link');

  if (!isOpen) return null;

  // The base clean URL
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return 'https://ais-dev-bktxgayldqbhgnu4b6bscq-812096117120.us-east1.run.app/';
  };

  const shareUrl = getShareUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `¡Mira nuestro Scrapbook de Recuerdos! 💕 Puedes abrirlo aquí: ${shareUrl}`
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-rose-500/50 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-fancy text-lg font-bold text-rose-200">
                Compartir Nuestro Scrapbook
              </h3>
              <p className="text-[11px] text-slate-400">
                Enlace libre para celular, WhatsApp y publicación en Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'bg-rose-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Enlace & WhatsApp
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'bg-black text-white border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" /> GitHub & Vercel (.app)
          </button>
        </div>

        {activeTab === 'link' ? (
          <>
            {/* Link container */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-400" />
                Enlace de la Página:
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent text-xs text-amber-200 font-mono outline-none w-full truncate select-all"
                />
                <button
                  onClick={handleCopy}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </a>

              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <span>Abrir en nueva pestaña</span>
              </a>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Compatible con celulares Android, iPhone, tablets y computadoras.</span>
            </div>
          </>
        ) : (
          /* GitHub & Vercel Tab */
          <div className="space-y-3.5 text-xs">
            <div className="bg-slate-950/90 border border-sky-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <GitBranch className="w-4 h-4" />
                <span>Repositorio Git Inicializado & Listo</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                El repositorio local ya está preparado con <strong className="text-white">vercel.json</strong> configurado para que al subirlo a GitHub y Vercel obtengas tu enlace oficial terminado en <strong className="text-emerald-400 font-mono">.vercel.app/</strong>
              </p>

              {/* Download ZIP Button */}
              <a
                href="/nuestro-scrapbook.zip"
                download="nuestro-scrapbook.zip"
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Código Completo (.ZIP)</span>
              </a>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-300">
              <p className="font-bold text-rose-300">Pasos para tener tu enlace .vercel.app/:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>Descarga el <strong>.ZIP</strong> con el botón de arriba.</li>
                <li>Sube los archivos a tu repositorio en <span className="text-white font-semibold">GitHub</span> (o usa el botón de Exportar de AI Studio).</li>
                <li>Entra a <span className="text-sky-400 font-semibold">vercel.com</span>, selecciona "Import Git Repository" y dale a Deploy.</li>
                <li>¡Listo! Tu web estará publicada con tu enlace <span className="text-emerald-300 font-mono">https://tu-scrapbook.vercel.app/</span></li>
              </ol>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-800/80">
          <span className="font-hand text-sm text-pink-300 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" /> Nuestro Scrapbook de Recuerdos
          </span>
        </div>
      </div>
    </div>
  );
};
