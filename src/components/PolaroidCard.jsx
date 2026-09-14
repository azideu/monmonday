import React, { useState } from 'react';
import { RotateCw, Calendar, MapPin, Camera } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';

export default function PolaroidCard({
  photo,
  index
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative group perspective-1000 select-none cursor-pointer py-4 focus:outline-none"
      onClick={toggleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isFlipped}
      aria-label={
        isFlipped 
          ? `Note on back of photo from ${photo.location}: "${photo.backNote}". Click to flip back.` 
          : `Photo from ${photo.location}: ${photo.caption}. Click to flip and read note.`
      }
      style={{
        transform: `rotate(${photo.cardTilt || '0deg'})`,
      }}
    >
      {/* Washi Tape Strip at top */}
      <div 
        className={`washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-5.5 z-30 rounded-xs transition-transform duration-300 ${photo.tapeColor || 'bg-skyMist/80'}`}
        style={{
          transform: `translateX(-50%) rotate(${photo.tapeRotation || '0deg'})`,
        }}
      />

      {/* 3D Card Container */}
      <div 
        className={`relative w-64 md:w-72 h-[340px] md:h-[360px] rounded-lg transition-transform duration-700 transform-style-3d shadow-paper group-hover:shadow-paper-elevated group-hover:scale-[1.02] group-focus:ring-2 group-focus:ring-skyMist ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-lg p-3.5 pb-5 flex flex-col justify-between backface-hidden border border-slateAsh/10">
          
          {/* Photo Frame */}
          <div className="relative w-full aspect-square bg-skyMist/20 rounded overflow-hidden shadow-inner flex items-center justify-center border border-dashed border-skyMist/80">
            {photo.imageUrl && !imgError ? (
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-skyMist/30 flex flex-col items-center justify-center p-4 text-center select-none">
                <Camera className="w-8 h-8 text-slateAsh/50 mb-1.5" />
                <span className="text-xs text-slateAsh/80 font-bold font-sans">Photo slot</span>
                <span className="text-xs text-slateAsh/60 mt-0.5 font-sans">Add your picture here</span>
              </div>
            )}

            {/* Flip Indicator hint: subtle badge on mobile, reveals on hover on desktop */}
            <div className="absolute bottom-2 right-2 bg-slateAsh/75 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity backdrop-blur-xs">
              <RotateCw className="w-3 h-3" />
              <span>Flip</span>
            </div>
          </div>

          {/* Polaroid Chin / Caption Area */}
          <div className="pt-3 px-1">
            <p className="font-handwriting text-slateAsh text-lg md:text-xl font-bold leading-tight truncate">
              {photo.caption}
            </p>
            <div className="flex items-center justify-between text-xs text-slateAsh/60 mt-1 font-sans">
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
        <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] rounded-lg p-5 flex flex-col justify-between rotate-y-180 backface-hidden border border-amber-900/15 shadow-inner-paper">
          
          {/* Top Stamp / Date on back of print */}
          <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-2">
            <span className="text-xs font-mono tracking-widest text-slateAsh/50 uppercase">
              Kodak Memory Print
            </span>
            <span className="text-xs font-mono text-slateAsh/60 font-semibold">
              {photo.date}
            </span>
          </div>

          {/* Handwritten Story / Note */}
          <div className="my-auto py-2 text-center">
            <div className="flex justify-center mb-2">
              <IconRenderer name={photo.doodle} className="w-6 h-6 text-slateAsh/70" fallback="sparkles" />
            </div>
            <p className="font-handwriting text-slateAsh text-xl md:text-2xl leading-relaxed">
              "{photo.backNote}"
            </p>
          </div>

          {/* Flip back footer prompt */}
          <div className="text-center pt-2 border-t border-slateAsh/10">
            <span className="inline-flex items-center gap-1 text-xs text-slateAsh/50 font-sans hover:text-slateAsh transition-colors">
              <RotateCw className="w-3 h-3" /> Click to flip to photo
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
