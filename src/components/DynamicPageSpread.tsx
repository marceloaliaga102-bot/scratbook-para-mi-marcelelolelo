import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Type,
  Layout,
  Palette,
  Heart,
  Move,
  RotateCw,
  Camera,
  Star,
  Quote,
  Pencil,
  Check
} from 'lucide-react';
import { CustomPage, PageElement } from '../types';

interface DynamicPageSpreadProps {
  spreadIndex: number;
  leftPageNumber: number;
  rightPageNumber: number;
  leftPageData?: CustomPage;
  rightPageData?: CustomPage;
  isAdmin: boolean;
  onUpdatePage: (pageNumber: number, page: CustomPage) => void;
  onOpenEdit: (
    title: string,
    value: string,
    type: 'image' | 'text' | 'textarea',
    onSave: (val: string) => void
  ) => void;
}

const TEMPLATES: Array<{
  id: NonNullable<CustomPage['template']>;
  name: string;
  icon: string;
  generateElements: (pageNumber: number) => PageElement[];
}> = [
  {
    id: 'blank',
    name: 'Lienzo Libre',
    icon: '📄',
    generateElements: (pn) => [
      {
        id: `el-${Date.now()}-1`,
        type: 'text',
        x: 10,
        y: 12,
        content: `Página ${pn} - Nuestra Memoria`,
        fontFamily: 'Caveat',
        fontSize: 28,
        color: '#881337',
      },
      {
        id: `el-${Date.now()}-2`,
        type: 'text',
        x: 10,
        y: 24,
        content: 'Escribe aquí un momento especial, una anécdota o una promesa de amor...',
        fontFamily: 'Quicksand',
        fontSize: 16,
        color: '#334155',
      },
    ],
  },
  {
    id: 'polaroid_duo',
    name: 'Dúo Polaroid',
    icon: '📸',
    generateElements: (pn) => [
      {
        id: `el-${Date.now()}-1`,
        type: 'polaroid',
        x: 15,
        y: 15,
        width: 65,
        content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
        title: 'Recuerdo Inolvidable',
        caption: 'Un día mágico a tu lado ♡',
        rotation: -3,
      },
      {
        id: `el-${Date.now()}-2`,
        type: 'quote',
        x: 10,
        y: 75,
        content: '"Tu sonrisa ilumina cada una de nuestras 500 páginas"',
        fontFamily: 'Caveat',
        fontSize: 22,
        color: '#9f1239',
      },
    ],
  },
  {
    id: 'letter',
    name: 'Carta de Amor',
    icon: '💌',
    generateElements: (pn) => [
      {
        id: `el-${Date.now()}-1`,
        type: 'text',
        x: 10,
        y: 10,
        content: 'Querido Osito,',
        fontFamily: 'Caveat',
        fontSize: 32,
        color: '#881337',
      },
      {
        id: `el-${Date.now()}-2`,
        type: 'text',
        x: 10,
        y: 25,
        content: 'Cada día que pasa me convenzo más de que encontrarte fue lo más bonito que me pasó en la vida. Gracias por cada risa, cada abrazo y cada empanada que compartimos...',
        fontFamily: 'Caveat',
        fontSize: 22,
        color: '#1e293b',
      },
      {
        id: `el-${Date.now()}-3`,
        type: 'sticker',
        x: 70,
        y: 75,
        content: '💌',
        fontSize: 40,
        rotation: 8,
      },
    ],
  },
  {
    id: 'quote_banner',
    name: 'Frase Destacada & Foto',
    icon: '✨',
    generateElements: (pn) => [
      {
        id: `el-${Date.now()}-1`,
        type: 'frame',
        x: 10,
        y: 12,
        width: 80,
        content: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop',
        title: 'Nuestra Foto Favorita',
        caption: 'Página ' + pn,
      },
      {
        id: `el-${Date.now()}-2`,
        type: 'quote',
        x: 8,
        y: 68,
        content: '"Si tuviera que elegir un solo lugar en el mundo, sería contigo."',
        fontFamily: 'Caveat',
        fontSize: 24,
        color: '#881337',
      },
    ],
  },
];

export const DynamicPageSpread: React.FC<DynamicPageSpreadProps> = ({
  leftPageNumber,
  rightPageNumber,
  leftPageData,
  rightPageData,
  isAdmin,
  onUpdatePage,
  onOpenEdit,
}) => {
  const renderSinglePage = (pageNumber: number, data?: CustomPage, isLeft: boolean = true) => {
    const pageData: CustomPage = data || {
      pageNumber,
      title: `Página ${pageNumber}`,
      subtitle: 'Nuestra Historia',
      elements: [
        {
          id: `init-${pageNumber}-1`,
          type: 'text',
          x: 10,
          y: 20,
          content: `Página ${pageNumber}`,
          fontFamily: 'Caveat',
          fontSize: 34,
          color: '#881337',
        },
        {
          id: `init-${pageNumber}-2`,
          type: 'text',
          x: 10,
          y: 35,
          content: isAdmin
            ? 'Esta página está lista para editar. Haz clic en "➕ Añadir Elemento" o elige una plantilla para empezar a diseñarla.'
            : 'Un rincón especial reservado en nuestro libro de recuerdos de amor.',
          fontFamily: 'Quicksand',
          fontSize: 16,
          color: '#475569',
        },
      ],
    };

    const handleApplyTemplate = (tmplId: NonNullable<CustomPage['template']>) => {
      const tmpl = TEMPLATES.find((t) => t.id === tmplId);
      if (!tmpl) return;
      const newPage: CustomPage = {
        ...pageData,
        template: tmplId,
        elements: tmpl.generateElements(pageNumber),
      };
      onUpdatePage(pageNumber, newPage);
    };

    const handleAddText = () => {
      onOpenEdit('Añadir Texto a Página ' + pageNumber, 'Nuevo recuerdo...', 'textarea', (text) => {
        if (!text) return;
        const newEl: PageElement = {
          id: `txt-${Date.now()}`,
          type: 'text',
          x: 15,
          y: 30 + (pageData.elements.length * 10) % 50,
          content: text,
          fontFamily: 'Caveat',
          fontSize: 22,
          color: '#1e293b',
        };
        onUpdatePage(pageNumber, {
          ...pageData,
          elements: [...pageData.elements, newEl],
        });
      });
    };

    const handleAddPhoto = () => {
      onOpenEdit(
        'Añadir Foto a Página ' + pageNumber,
        'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
        'image',
        (url) => {
          if (!url) return;
          const newEl: PageElement = {
            id: `img-${Date.now()}`,
            type: 'polaroid',
            x: 15,
            y: 20,
            width: 70,
            content: url,
            title: 'Foto de Amor',
            caption: 'Página ' + pageNumber,
            rotation: (Math.random() - 0.5) * 6,
          };
          onUpdatePage(pageNumber, {
            ...pageData,
            elements: [...pageData.elements, newEl],
          });
        }
      );
    };

    const handleAddSticker = (emoji: string) => {
      const newEl: PageElement = {
        id: `stk-${Date.now()}`,
        type: 'sticker',
        x: 40 + (Math.random() - 0.5) * 30,
        y: 40 + (Math.random() - 0.5) * 30,
        content: emoji,
        fontSize: 36,
        rotation: (Math.random() - 0.5) * 20,
      };
      onUpdatePage(pageNumber, {
        ...pageData,
        elements: [...pageData.elements, newEl],
      });
    };

    const handleDeleteElement = (id: string) => {
      onUpdatePage(pageNumber, {
        ...pageData,
        elements: pageData.elements.filter((el) => el.id !== id),
      });
    };

    const handleRotateElement = (id: string) => {
      onUpdatePage(pageNumber, {
        ...pageData,
        elements: pageData.elements.map((el) => {
          if (el.id === id) {
            const currentRot = el.rotation || 0;
            return { ...el, rotation: (currentRot + 15) % 360 };
          }
          return el;
        }),
      });
    };

    const handleEditElement = (el: PageElement) => {
      if (!isAdmin) return;
      if (el.type === 'image' || el.type === 'polaroid' || el.type === 'frame') {
        onOpenEdit('Editar URL de Imagen', el.content, 'image', (newUrl) => {
          onUpdatePage(pageNumber, {
            ...pageData,
            elements: pageData.elements.map((item) =>
              item.id === el.id ? { ...item, content: newUrl } : item
            ),
          });
        });
      } else {
        onOpenEdit('Editar Texto', el.content, 'textarea', (newText) => {
          onUpdatePage(pageNumber, {
            ...pageData,
            elements: pageData.elements.map((item) =>
              item.id === el.id ? { ...item, content: newText } : item
            ),
          });
        });
      }
    };

    return (
      <div
        className={`bg-paper-texture p-6 sm:p-8 md:p-10 flex flex-col justify-between relative min-h-[720px] ${
          isLeft
            ? 'book-spine-shadow-left border-r border-slate-300/40'
            : 'book-spine-shadow-right'
        }`}
      >
        {/* Top Header Ribbon & Info */}
        <div className="flex items-center justify-between border-b border-dashed border-slate-300/60 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded shadow-sm inline-block ${
                isLeft ? 'washi-tape-cyan -rotate-1' : 'washi-tape-pink rotate-1'
              }`}
            >
              <span className="font-sans-ui font-extrabold text-xs sm:text-sm tracking-wider text-slate-900 uppercase">
                PÁGINA {pageNumber.toString().padStart(2, '0')} • NUESTRO LIBRO
              </span>
            </div>
            {isAdmin && (
              <span className="text-[10px] bg-rose-500/20 text-rose-800 border border-rose-400 px-2 py-0.5 rounded-full font-bold">
                ✏️ Editable
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-bold">
            {pageNumber} / 500
          </span>
        </div>

        {/* Admin Quick Editor Toolbar (Only visible to Admin) */}
        {isAdmin && (
          <div className="my-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-sky-200 shadow-sm flex flex-wrap items-center gap-1.5 text-xs z-20">
            <button
              onClick={handleAddText}
              className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold flex items-center gap-1 transition"
            >
              <Type className="w-3.5 h-3.5" />
              <span>+ Texto</span>
            </button>
            <button
              onClick={handleAddPhoto}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold flex items-center gap-1 transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Foto</span>
            </button>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              <span className="text-[10px] font-bold text-amber-900">Stickers:</span>
              {['❤️', '🥟', '✨', '🐻', '🌙', '💍', '🌟'].map((stk) => (
                <button
                  key={stk}
                  onClick={() => handleAddSticker(stk)}
                  className="hover:scale-125 transition text-sm"
                  title="Añadir sticker"
                >
                  {stk}
                </button>
              ))}
            </div>
            {/* Template selector dropdown */}
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-bold">Plantilla:</span>
              <select
                value={pageData.template || 'blank'}
                onChange={(e) =>
                  handleApplyTemplate(e.target.value as NonNullable<CustomPage['template']>)
                }
                className="text-[11px] bg-slate-50 border border-slate-300 rounded px-2 py-1 outline-none text-slate-800 font-medium"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Dynamic Canvas / Visual Elements Container */}
        <div className="relative flex-1 w-full my-auto py-4 min-h-[460px]">
          {pageData.elements.map((el) => {
            const rotStyle = el.rotation ? `rotate(${el.rotation}deg)` : 'none';

            return (
              <div
                key={el.id}
                style={{
                  transform: rotStyle,
                  transformOrigin: 'center center',
                }}
                className={`relative my-4 transition duration-200 group ${
                  isAdmin ? 'cursor-pointer hover:ring-2 hover:ring-rose-400 rounded-lg p-1' : ''
                }`}
              >
                {/* Admin controls for individual element */}
                {isAdmin && (
                  <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-slate-900/90 text-white px-2 py-0.5 rounded-full text-[10px] shadow z-30 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditElement(el);
                      }}
                      className="hover:text-amber-300"
                      title="Editar contenido"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotateElement(el.id);
                      }}
                      className="hover:text-sky-300"
                      title="Girar"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(el.id);
                      }}
                      className="hover:text-rose-400"
                      title="Eliminar elemento"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Render by type */}
                {el.type === 'text' && (
                  <div
                    onClick={() => handleEditElement(el)}
                    style={{
                      fontFamily: el.fontFamily || 'Caveat',
                      fontSize: `${el.fontSize || 22}px`,
                      color: el.color || '#1e293b',
                    }}
                    className="leading-relaxed whitespace-pre-wrap select-text"
                  >
                    {el.content}
                  </div>
                )}

                {el.type === 'quote' && (
                  <div
                    onClick={() => handleEditElement(el)}
                    className="p-4 bg-amber-50/80 rounded-2xl border-l-4 border-rose-500 shadow-sm"
                  >
                    <Quote className="w-5 h-5 text-rose-400 mb-1" />
                    <p
                      style={{
                        fontFamily: el.fontFamily || 'Caveat',
                        fontSize: `${el.fontSize || 24}px`,
                        color: el.color || '#881337',
                      }}
                      className="font-bold leading-relaxed"
                    >
                      {el.content}
                    </p>
                  </div>
                )}

                {el.type === 'polaroid' && (
                  <div
                    onClick={() => handleEditElement(el)}
                    className="bg-white p-3 rounded-xl shadow-xl border border-slate-200/80 max-w-sm mx-auto"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2">
                      <img
                        src={el.content}
                        alt="Foto de Scrapbook"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    {el.title && (
                      <p className="font-hand text-xl font-bold text-slate-800 text-center">
                        {el.title}
                      </p>
                    )}
                    {el.caption && (
                      <p className="font-mono text-[10px] text-slate-500 text-center">
                        {el.caption}
                      </p>
                    )}
                  </div>
                )}

                {el.type === 'frame' && (
                  <div
                    onClick={() => handleEditElement(el)}
                    className="relative p-2 rounded-2xl bg-gradient-to-tr from-amber-200 via-rose-200 to-sky-200 shadow-xl max-w-md mx-auto"
                  >
                    <div className="rounded-xl overflow-hidden bg-white p-1">
                      <img
                        src={el.content}
                        alt="Marco de foto"
                        className="w-full h-56 sm:h-64 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                    {el.title && (
                      <div className="absolute bottom-4 left-6 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                        {el.title}
                      </div>
                    )}
                  </div>
                )}

                {el.type === 'sticker' && (
                  <div
                    onClick={() => handleEditElement(el)}
                    style={{ fontSize: `${el.fontSize || 36}px` }}
                    className="select-none inline-block filter drop-shadow-md"
                  >
                    {el.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500">
          <span className="font-hand text-base text-rose-700">
            ♥ Nuestro Scrapbook • 500 Páginas
          </span>
          <span className="font-mono text-[10px]">Página {pageNumber}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0 h-full w-full">
      {renderSinglePage(leftPageNumber, leftPageData, true)}
      {renderSinglePage(rightPageNumber, rightPageData, false)}
    </div>
  );
};
