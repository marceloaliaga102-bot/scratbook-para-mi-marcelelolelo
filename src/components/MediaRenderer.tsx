import React from 'react';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

/**
 * Renderiza de forma inteligente fotos o videos (mp4, webm, dataURLs, links de video).
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = 'Recuerdo romántico',
  className = 'w-full h-full object-cover',
  controls = true,
  autoPlay = true,
  loop = true,
  muted = true,
}) => {
  if (!src) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono">
        Sin multimedia
      </div>
    );
  }

  const isVideo =
    src.startsWith('data:video') ||
    src.endsWith('.mp4') ||
    src.endsWith('.webm') ||
    src.endsWith('.mov') ||
    src.includes('/video/') ||
    src.includes('.mp4?') ||
    src.includes('.webm?');

  if (isVideo) {
    return (
      <video
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className={className}
      />
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
};
