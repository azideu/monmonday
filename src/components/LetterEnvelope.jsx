import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';

export default function LetterEnvelope({ letter, onOpenLetter, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Organic slight tilts for realism
  const tilts = ['-2deg', '1.5deg', '-1deg', '2deg'];
  const tilt = tilts[index % tilts.length];

  return (
    <div
      className="relative select-none py-3"
      style={{ transform: `rotate(${tilt})` }}
    >
      {/* Pinned washi tape in corner */}
      <div
        className="washi-tape absolute -top-1 right-6 w-20 h-5 bg-white/75 z-20 rounded-xs rotate-3 border border-slateAsh/10"
      />

      {/* Envelope Card Body */}
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => onOpenLetter(letter)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenLetter(letter);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Open letter from ${letter.author}`}
        className={`relative w-72 md:w-80 h-52 rounded-xl p-4 cursor-pointer shadow-paper transition-shadow duration-300 hover:shadow-paper-hover border border-slateAsh/15 overflow-hidden ${letter.envelopeColor || 'bg-skyMist'
          }`}
      >
        {/* Envelope Flap Lines Geometry */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Flap Triangle */}
          <div
            className="absolute top-0 left-0 right-0 h-28 bg-white/20 border-b border-slateAsh/10 transition-all duration-300"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />
          {/* Bottom Flap Triangle */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 bg-white/10"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 10%)',
            }}
          />
        </div>

        {/* Vintage Airmail Postage Stamp */}
        <div className="absolute top-3 right-3 z-10 w-12 h-14 bg-white rounded border border-dashed border-slateAsh/40 p-1 flex flex-col items-center justify-between shadow-paper-sm">
          <span className="text-xs scale-75 origin-top font-mono font-bold tracking-tighter text-slateAsh/60 inline-block">
            {letter.stampText || "POST"}
          </span>
          <Mail className="w-4 h-4 text-slateAsh/70" strokeWidth={1.75} />
          <span className="text-xs scale-75 origin-bottom font-mono text-slateAsh/60 inline-block">2026</span>
          {/* Cancellation stamp wavy lines */}
          <div className="absolute -left-6 top-3 flex flex-col gap-0.5 pointer-events-none opacity-40">
            <div className="w-8 h-0.5 bg-slateAsh rounded" />
            <div className="w-10 h-0.5 bg-slateAsh rounded" />
            <div className="w-8 h-0.5 bg-slateAsh rounded" />
          </div>
        </div>

        {/* Wax Seal in the center of the flap */}
        <div className="absolute top-[86px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 border-white/60 relative cursor-pointer"
            style={{ backgroundColor: letter.sealColor || '#FFD6D6' }}
          >
            <IconRenderer name={letter.sealIcon} className="w-5 h-5 text-slateAsh filter drop-shadow-sm" fallback="heart" strokeWidth={2} />
            {/* Wax rim detail */}
            <div className="absolute inset-0.5 rounded-full border border-slateAsh/15 pointer-events-none" />
          </motion.div>
        </div>

        {/* Addressing area */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="border-b border-dashed border-slateAsh/25 pb-1 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-slateAsh/60 block">
              To:
            </span>
            <span className="font-handwriting text-2xl text-slateAsh font-bold">
              Monmonkyu
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slateAsh/80">
            <span className="font-sans font-medium flex items-center gap-1 truncate max-w-[170px]">
              From: <strong className="font-bold text-slateAsh">{letter.author}</strong>
            </span>
            <span className="text-xs font-mono text-slateAsh/60 bg-white/60 px-2 py-0.5 rounded-full border border-slateAsh/10">
              {letter.date}
            </span>
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div
          className={`absolute inset-0 bg-white/20 backdrop-blur-[0.5px] z-30 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="bg-white/90 text-slateAsh text-xs font-semibold px-3 py-1.5 rounded-full shadow-paper-sm border border-slateAsh/15 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-coralBlush" />
            Click to open
          </div>
        </div>

      </motion.div>
    </div>
  );
}
