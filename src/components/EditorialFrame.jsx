import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function EditorialFrame({ 
  src, 
  mediaType = 'image', 
  alt, 
  label, 
  sublabel, 
  className = '', 
  aspectClass = 'aspect-[4/5]' 
}) {
  const { isDark } = useTheme();

  if (src) {
    return (
      <div className={`relative overflow-hidden group ${aspectClass} ${className}`}>
        {mediaType === 'video' ? (
          <video
            src={src}
            controls
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <img
            src={src}
            alt={alt || label || 'Dokumentasi Sabila'}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>
    );
  }

  // Artistic SVG placeholder (no stock photos)
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-500 ${aspectClass} ${className} ${
        isDark
          ? 'bg-[#202F46] border border-[#C5A56A]/35 text-[#E1E5EB]'
          : 'bg-[#FAF0D8] border border-[#2C2520]/15 text-[#2C2520]'
      }`}
    >
      <svg viewBox="0 0 200 240" className="w-28 h-32 mb-3 opacity-60 transition-transform duration-700 hover:scale-105" fill="none">
        <path d="M30 220V95C30 56.3401 61.3401 25 100 25C138.66 25 170 56.3401 170 95V220" stroke={isDark ? '#C5A56A' : '#5B7C99'} strokeWidth="1.5" strokeDasharray="4 4"/>
        <circle cx="100" cy="95" r="34" stroke={isDark ? '#C7CED8' : '#C48B9F'} strokeWidth="1.5"/>
        <path d="M100 61C112 78 112 112 100 129C88 112 88 78 100 61Z" stroke={isDark ? '#D8C49A' : '#D4B459'} strokeWidth="1.5"/>
        <line x1="20" y1="220" x2="180" y2="220" stroke={isDark ? '#C5A56A' : '#2C2520'} strokeWidth="1" opacity="0.4"/>
      </svg>
      <span className="font-editorial italic text-base tracking-wide">
        {label || 'Ruang Dokumentasi Visual'}
      </span>
      <span className={`text-xs mt-1.5 max-w-[210px] leading-relaxed ${isDark ? 'text-[#C7CED8]' : 'text-[#6E655F]'}`}>
        {sublabel || 'Unggah foto asli melalui Admin Dashboard'}
      </span>
    </div>
  );
}

export default EditorialFrame;
