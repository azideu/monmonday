import React, { useState } from 'react';
import { RotateCw, Calendar, MapPin } from 'lucide-react';

export default function PolaroidCard({
  photo,
  index
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Fallback if image fails to load
  const [imgError, setImgError] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative group perspective-1000 select-none cursor-pointer py-4"
      onClick={toggleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Photo from ${photo.location}: ${photo.caption}. Click to flip.`}
      style={{
        transform: `rotate(${photo.cardTilt || '0deg'})`,
      }}
    >
      {/* Washi Tape Strip at top */}
      <div 
        className={`washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-5.5 z-30 rounded-xs transition-transform duration-300 ${photo.tapeColor || 'bg-buttercup/75'}`}
        style={{
          transform: `translateX(-50%) rotate(${photo.tapeRotation || '0deg'})`,
        }}
      />

      {/* 3D Card Container */}
      <div 
        className={`relative w-64 md:w-72 h-[340px] md:h-[360px] rounded-lg transition-transform duration-700 transform-style-3d shadow-paper group-hover:shadow-paper-elevated group-hover:scale-[1.02] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-lg p-3.5 pb-5 flex flex-col justify-between backface-hidden border border-slateAsh/10">
          
          {/* Photo Frame */}
          <div className="relative w-full aspect-square bg-slateAsh/10 rounded overflow-hidden shadow-inner flex items-center justify-center">
            {!imgError ? (
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-skyMist/40 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl mb-1">📷</span>
                <span className="text-xs text-slateAsh/70 font-medium">Memory Snapshot</span>
              </div>
            )}

            {/* Flip Indicator hint */}
            <div className="absolute bottom-2 right-2 bg-slateAsh/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
              <RotateCw className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Polaroid Chin / Caption Area */}
          <div className="pt-3 px-1">
            <p className="font-handwriting text-slateAsh text-lg md:text-xl font-bold leading-tight truncate">
              {photo.caption}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slateAsh/60 mt-1 font-sans">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {photo.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {photo.location}
              </span>
            </div>
          </div>
        </div>

        {/* BACK SIDE (Secret memory note) */}
        <div className="absolute inset-0 w-full h-full bg-[#FCFBF7] rounded-lg p-5 flex flex-col justify-between rotate-y-180 backface-hidden border border-amber-900/15 shadow-inner-paper">
          
          {/* Top Stamp / Date on back of print */}
          <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-slateAsh/50 uppercase">
              Kodak Memory Print
            </span>
            <span className="text-[10px] font-mono text-slateAsh/60 font-semibold">
              {photo.date}
            </span>
          </div>

          {/* Handwritten Story / Note */}
          <div className="my-auto py-2 text-center">
            <span className="text-2xl block mb-2">{photo.doodle || '✨'}</span>
            <p className="font-handwriting text-slateAsh text-xl md:text-2xl leading-relaxed">
              "{photo.backNote}"
            </p>
          </div>

          {/* Flip back footer prompt */}
          <div className="text-center pt-2 border-t border-slateAsh/10">
            <span className="inline-flex items-center gap-1 text-[11px] text-slateAsh/50 font-sans hover:text-slateAsh transition-colors">
              <RotateCw className="w-3 h-3" /> Click to flip to photo
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
