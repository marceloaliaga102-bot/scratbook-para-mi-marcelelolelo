import React, { useEffect, useState } from 'react';

interface EmpanadaRainProps {
  triggerKey: number;
  showTextInitially?: boolean;
}

interface EmpanadaParticle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  swayAmount: number;
}

export const EmpanadaRain: React.FC<EmpanadaRainProps> = ({ triggerKey, showTextInitially = true }) => {
  const [particles, setParticles] = useState<EmpanadaParticle[]>([]);
  const [showMessage, setShowMessage] = useState(showTextInitially);

  useEffect(() => {
    // Generate 35 crispy golden empanadas with staggered delays
    const newParticles: EmpanadaParticle[] = Array.from({ length: 35 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.floor(Math.random() * 24) + 38, // 38px to 62px
      duration: Math.random() * 2.5 + 3.0, // 3.0s to 5.5s
      delay: Math.random() * 2.0, // 0 to 2.0s
      rotation: Math.floor(Math.random() * 360),
      swayAmount: (Math.random() - 0.5) * 60,
    }));

    setParticles(newParticles);
    setShowMessage(true);

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, [triggerKey]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Floating text: 'te amo demasiado mi osito' */}
      {showMessage && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce duration-1000 transition-opacity">
          <div className="glass-pill px-8 py-4 rounded-full shadow-2xl border-2 border-amber-300/80 flex items-center gap-3 backdrop-blur-md bg-white/90">
            <span className="text-3xl animate-spin">🥟</span>
            <span className="font-fancy text-3xl md:text-4xl text-amber-900 font-bold tracking-wide drop-shadow-sm whitespace-nowrap">
              ¡Te amo demasiado mi osito!
            </span>
            <span className="text-3xl animate-pulse">✨</span>
          </div>
        </div>
      )}

      {/* 100% Golden Crispy Meat Empanadas */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="falling-empanada absolute"
          style={{
            left: `${p.left}%`,
            top: '-60px',
            width: `${p.size}px`,
            height: `${p.size * 0.72}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {/* Beautiful Crispy Handcrafted Golden Empanada with Repulgue */}
          <svg
            viewBox="0 0 100 70"
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(180,83,9,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`goldEmpGrad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id={`crustHighlight-${p.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Empanada body */}
            <path
              d="M 5,50 Q 50,-10 95,50 Q 75,62 50,62 Q 25,62 5,50 Z"
              fill={`url(#goldEmpGrad-${p.id})`}
              stroke="#78350f"
              strokeWidth="2.5"
            />
            {/* Repulgue folds along the arch */}
            <path
              d="M 6,48 Q 12,38 18,36 Q 25,24 33,21 Q 42,12 50,11 Q 59,12 67,21 Q 76,25 83,36 Q 89,39 94,48"
              stroke="#92400e"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Crust twist ridges */}
            <path d="M 16,38 L 18,44" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M 31,23 L 34,31" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M 49,13 L 50,21" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M 68,22 L 66,30" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M 83,37 L 81,44" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            {/* Golden baked shine */}
            <path
              d="M 22,42 Q 50,24 78,42"
              fill="none"
              stroke={`url(#crustHighlight-${p.id})`}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Meat steam vent fork pricks */}
            <circle cx="45" cy="40" r="1.5" fill="#78350f" />
            <circle cx="55" cy="40" r="1.5" fill="#78350f" />
            <circle cx="50" cy="46" r="1.5" fill="#78350f" />
          </svg>
        </div>
      ))}
    </div>
  );
};
