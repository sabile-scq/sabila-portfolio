import React from 'react';
import { Eye, Video, Image as ImageIcon } from 'lucide-react';
import { EditorialFrame } from './EditorialFrame';
import { useTheme } from '../context/ThemeContext';

export const MediaGallery = ({
  items = [],
  onMediaClick,
  columns = 4,
  aspectClass = 'aspect-[4/3]',
  emptyLabel = 'Ruang Dokumentasi Visual',
  emptySublabel = 'Unggah foto asli melalui Studio Admin',
  className = ''
}) => {
  const { isDark } = useTheme();

  if (!items || items.length === 0) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ${className}`}>
        <EditorialFrame
          label={emptyLabel}
          sublabel={emptySublabel}
          isDark={isDark}
          aspectClass={aspectClass}
          className="rounded-2xl"
        />
        <EditorialFrame
          label="Dokumentasi Visual 02"
          sublabel="Mendukung JPG, PNG, WEBP, dan Video MP4"
          isDark={isDark}
          aspectClass={aspectClass}
          className="rounded-2xl"
        />
        <EditorialFrame
          label="Dokumentasi Visual 03"
          sublabel="Kelola melalui Admin Studio"
          isDark={isDark}
          aspectClass={aspectClass}
          className="rounded-2xl"
        />
      </div>
    );
  }

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${colClasses} gap-5 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          onClick={() => onMediaClick && onMediaClick(item)}
          className={`group cursor-pointer rounded-2xl overflow-hidden border p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-[#FFFCF8] border-[#CFE3F2]'
          }`}
        >
          <div className="relative overflow-hidden rounded-xl">
            <EditorialFrame
              src={item.url || item.mediaUrl}
              mediaType={item.type || item.mediaType || 'image'}
              alt={item.title || 'Dokumentasi'}
              isDark={isDark}
              aspectClass={aspectClass}
            />
            {/* Hover overlay button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-1.5 text-xs font-semibold backdrop-blur-[2px]">
              <Eye className="w-4 h-4" />
              <span>Lihat Detail</span>
            </div>
            {item.type === 'video' && (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>Video</span>
              </div>
            )}
          </div>
          {(item.title || item.caption) && (
            <div className="pt-3 px-1">
              {item.title && (
                <p className={`font-editorial text-base font-semibold leading-snug line-clamp-1 ${isDark ? 'text-[#E1E5EB]' : 'text-[#2C2520]'}`}>
                  {item.title}
                </p>
              )}
              {item.caption && (
                <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${isDark ? 'text-[#C7CED8]' : 'text-[#6E655F]'}`}>
                  {item.caption}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
