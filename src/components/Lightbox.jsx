import React from 'react';
import { X } from 'lucide-react';

export function Lightbox({ media, onClose }) {
  if (!media) return null;
  const isVideo = media.type === 'video' || media.mediaType === 'video';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-reveal-up"
    >
      <button
        onClick={onClose}
        type="button"
        aria-label="Tutup Pratinjau Media"
        className="absolute top-6 right-6 p-3 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full flex flex-col items-center">
        {isVideo ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-h-[75vh] rounded-2xl shadow-2xl"
          />
        ) : (
          <img
            src={media.url}
            alt={media.title || 'Preview'}
            className="max-h-[75vh] object-contain rounded-2xl shadow-2xl"
          />
        )}
        {(media.title || media.caption) && (
          <div className="mt-4 text-center text-white">
            {media.title && <h4 className="font-editorial text-2xl">{media.title}</h4>}
            {media.caption && <p className="text-sm text-white/75 mt-1">{media.caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lightbox;
