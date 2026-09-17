import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Calendar, MapPin, Camera, Maximize2 } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { playPaperRustle } from '../utils/soundEffects.js';

export default function PolaroidCard({
  photo,
  index,
  onExpandPhoto,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleFlip = (e) => {
    e?.stopPropagation?.();
    playPaperRustle();
    setIsFlipped((prev) => !prev);
  };

  const handlePhotoClick = (e) => {
    e?.stopPropagation?.();
    if (photo.imageUrl && !imgError && onExpandPhoto) {
      playPaperRustle();
      onExpandPhoto(photo, index);
    } else {
      toggleFlip(e);
    }
  };

  return (
    <div
      className="relative select-none py-4"
      style={{
        transform: `rotate(${photo.cardTilt || '0deg'})`,
      }}
    >
      <motion.div 
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative group focus:outline-none"
        onClick={isFlipped ? toggleFlip : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip(e);
          }
        }}
        role="region"
        tabIndex={0}
        aria-expanded={isFlipped}
        aria-label={
          isFlipped 
            ? `Note on back of photo from ${photo.location}: "${photo.backNote}". Click to flip back.` 
            : `Photo from ${photo.location}: ${photo.caption}. Click image to expand, or click chin to flip.`
        }
      >
        {/* 3D Card Container */}
        <div 
          className={`relative w-[280px] xs:w-72 sm:w-72 h-[350px] sm:h-[360px] max-w-[calc(100vw-2.5rem)] rounded-lg transition-transform duration-700 transform-style-3d shadow-paper group-hover:shadow-paper-elevated group-focus:ring-2 group-focus:ring-skyMist ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
        {/* Washi Tape Strip pinned to card top edge */}
        <div 
          className={`washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5.5 z-30 rounded-xs transition-transform duration-300 pointer-events-none ${photo.tapeColor || 'bg-skyMist/80'}`}
          style={{
            transform: `translateX(-50%) rotate(${photo.tapeRotation || '0deg'})`,
          }}
        />
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-lg p-3.5 pb-5 flex flex-col justify-between backface-hidden border border-slateAsh/10">
          
          {/* Photo Frame (Click to Expand Full Image) */}
          <div 
            onClick={handlePhotoClick}
            className="relative w-full aspect-square bg-skyMist/20 rounded overflow-hidden shadow-inner flex items-center justify-center border border-dashed border-skyMist/80 cursor-pointer group/photo"
            role="button"
            tabIndex={0}
            aria-label={`Expand full image of ${photo.caption}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePhotoClick(e);
              }
            }}
          >
            {photo.imageUrl && !imgError ? (
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-skyMist/30 flex flex-col items-center justify-center p-4 text-center select-none">
                <Camera className="w-8 h-8 text-slateAsh/50 mb-1.5" />
                <span className="text-xs text-slateAsh/80 font-bold font-sans">Memory Snapshot</span>
                <span className="text-xs text-slateAsh/60 mt-0.5 font-sans">Click to read note</span>
              </div>
            )}

            {/* Expand Image Badge (Bottom Left) */}
            {photo.imageUrl && !imgError && (
              <div className="absolute bottom-2.5 left-2.5 bg-slateAsh/85 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-paper-sm opacity-90 sm:opacity-0 sm:group-hover/photo:opacity-100 transition-all backdrop-blur-xs border border-white/20 select-none">
                <Maximize2 className="w-3 h-3 text-skyMist" />
                <span className="text-xs tracking-wide font-sans">Expand</span>
              </div>
            )}

            {/* Flip Indicator hint (Bottom Right) */}
            <button
              type="button"
              onClick={toggleFlip}
              className="absolute bottom-2.5 right-2.5 bg-slateAsh/85 hover:bg-slateAsh text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-paper-sm opacity-90 sm:opacity-0 sm:group-hover/photo:opacity-100 transition-all backdrop-blur-xs border border-white/20 select-none cursor-pointer"
              title="Flip to read note"
              aria-label="Flip to read note"
            >
              <RotateCw className="w-3 h-3" />
              <span className="text-xs tracking-wide font-sans">Flip Note</span>
            </button>
          </div>

          {/* Polaroid Chin / Caption Area (Click to Flip) */}
          <div 
            onClick={toggleFlip}
            className="pt-3 px-1 cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Flip card to read note for ${photo.caption}`}
          >
            <p className="font-handwriting text-slateAsh text-lg md:text-xl font-bold leading-tight truncate hover:text-slateAsh/80 transition-colors">
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
        <div 
          onClick={toggleFlip}
          className="absolute inset-0 w-full h-full bg-[#FFFDF9] rounded-lg p-5 flex flex-col justify-between rotate-y-180 backface-hidden border border-amber-900/15 shadow-inner-paper cursor-pointer"
        >
          
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
      </motion.div>
    </div>
  );
}
