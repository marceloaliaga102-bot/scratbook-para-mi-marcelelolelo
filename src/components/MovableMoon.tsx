import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

interface MovableMoonProps {
  onMoonClick?: () => void;
}

export const MovableMoon: React.FC<MovableMoonProps> = () => {
  // Initial moon position near top-right
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    return {
      x: typeof window !== 'undefined' ? window.innerWidth - 180 : 800,
      y: 70,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [moonStyle, setMoonStyle] = useState<'golden' | 'pink' | 'silver'>('golden');
  const [showTooltip, setShowTooltip] = useState(true);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setShowTooltip(false);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      setShowTooltip(false);
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        posX: position.x,
        posY: position.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(20, Math.min(window.innerWidth - 120, dragRef.current.posX + dx)),
        y: Math.max(20, Math.min(window.innerHeight - 120, dragRef.current.posY + dy)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(20, Math.min(window.innerWidth - 120, dragRef.current.posX + dx)),
        y: Math.max(20, Math.min(window.innerHeight - 120, dragRef.current.posY + dy)),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const cycleMoonStyle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (moonStyle === 'golden') setMoonStyle('pink');
    else if (moonStyle === 'pink') setMoonStyle('silver');
    else setMoonStyle('golden');
  };

  // Color schemes for moon styles
  const moonGlow = {
    golden: 'from-amber-200 via-amber-300 to-yellow-100 shadow-[0_0_80px_rgba(251,191,36,0.55),0_0_120px_rgba(245,158,11,0.25)]',
    pink: 'from-pink-200 via-rose-300 to-amber-100 shadow-[0_0_80px_rgba(244,63,94,0.55),0_0_120px_rgba(236,72,153,0.3)]',
    silver: 'from-slate-100 via-blue-100 to-indigo-100 shadow-[0_0_80px_rgba(199,210,254,0.55),0_0_120px_rgba(147,197,253,0.25)]',
  };

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="fixed z-10 select-none cursor-grab active:cursor-grabbing transition-transform duration-75"
    >
      {/* Glow Halo */}
      <div
        className={`absolute -inset-6 rounded-full blur-xl opacity-70 pointer-events-none transition-all duration-700 ${
          moonStyle === 'golden'
            ? 'bg-amber-400/30'
            : moonStyle === 'pink'
            ? 'bg-rose-400/35'
            : 'bg-indigo-300/30'
        }`}
      />

      {/* Moon Orb */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${moonGlow[moonStyle]} transition-all duration-700 flex items-center justify-center overflow-hidden border border-white/60 group`}
      >
        {/* Realistic craters & texture */}
        <div className="absolute top-4 left-5 w-5 h-5 rounded-full bg-black/10 blur-[1px]" />
        <div className="absolute top-10 left-12 w-8 h-8 rounded-full bg-black/8 blur-[1px]" />
        <div className="absolute bottom-5 left-7 w-6 h-6 rounded-full bg-black/10 blur-[1px]" />
        <div className="absolute bottom-8 right-6 w-4 h-4 rounded-full bg-black/12 blur-[1px]" />
        <div className="absolute top-6 right-7 w-3 h-3 rounded-full bg-black/8 blur-[1px]" />

        {/* Subtle cute heart crater in center */}
        <div className="text-black/10 text-xl transform -rotate-12 pointer-events-none select-none">
          ❤️
        </div>

        {/* Floating clouds across the moon */}
        <div className="absolute -inset-x-4 top-1/2 h-8 bg-white/20 blur-md rounded-full transform -rotate-6 pointer-events-none" />

        {/* Style toggle mini button on hover */}
        <button
          onClick={cycleMoonStyle}
          title="Cambiar color de luna (Dorada, Rosa, Plateada)"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/25 backdrop-blur-[2px] rounded-full transition-opacity text-white text-xs font-medium"
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Helper floating hint */}
      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-amber-200 border border-amber-400/30 animate-pulse pointer-events-none shadow-lg">
          🌙 ¡Arrástrame donde quieras!
        </div>
      )}
    </div>
  );
};
