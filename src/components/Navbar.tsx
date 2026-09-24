import React from 'react';
import {
  Heart,
  Moon,
  Sun,
  Lock,
  Unlock,
  Sparkles,
  BookOpen,
  Music,
} from 'lucide-react';
import { ThemeSettings } from '../types';

interface NavbarProps {
  theme: ThemeSettings;
  onToggleThemeMode: () => void;
  onOpenAdmin: () => void;
  isAdminUnlocked: boolean;
  onTriggerRain: () => void;
  recipientName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleThemeMode,
  onOpenAdmin,
  isAdminUnlocked,
  onTriggerRain,
  recipientName,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-35 bg-slate-950/70 backdrop-blur-md border-b border-rose-500/20 px-3 sm:px-6 py-2.5 flex items-center justify-between text-white transition-all">
      {/* Brand / Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md">
          <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span
            className="text-base sm:text-xl font-bold tracking-tight text-amber-200"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Para {recipientName}
          </span>
          <span className="text-[10px] text-rose-300 font-medium tracking-wider uppercase hidden sm:block">
            Libro de Recuerdos & Amor
          </span>
        </div>
      </div>

      {/* Center Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Night mode toggle */}
        <button
          onClick={onToggleThemeMode}
          title={`Modo actual: ${theme.mode}. Haz clic para cambiar`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 border border-white/15 transition-all"
        >
          {theme.mode === 'night' || theme.mode === 'candlelight' ? (
            <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span className="hidden sm:inline capitalize">
            {theme.mode === 'auto' ? 'Noche Auto' : theme.mode}
          </span>
        </button>

        {/* Rain of Empanadas button */}
        <button
          onClick={onTriggerRain}
          title="Lluvia de empanadas"
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span className="text-sm">🥟</span>
          <span className="hidden md:inline">Empanadas</span>
        </button>

        {/* Admin account button */}
        <button
          onClick={onOpenAdmin}
          title={isAdminUnlocked ? 'Panel de Administración (Desbloqueado)' : 'Cuenta Admin (Solo tú)'}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            isAdminUnlocked
              ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-900/40'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/15'
          }`}
        >
          {isAdminUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Admin Activo</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Cuenta Admin</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
