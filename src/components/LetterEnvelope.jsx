import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Image as ImageIcon, Volume2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import IconRenderer from './IconRenderer.jsx';

export default function LetterEnvelope({ letter, onOpenLetter, index, defaultRecipient = "Monmonkyu", isRead = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const recipient = letter?.recipientNickname || letter?.recipient || letter?.to || defaultRecipient;
  const hasImages = Boolean(
    letter?.scanUrl ||
    letter?.imageUrl ||
    letter?.image ||
    (Array.isArray(letter?.images) && letter.images.length > 0)
  );

  const handleOpen = (e) => {
    e?.stopPropagation?.();

    // Gentle pastel confetti sparkle on unsealing the wax stamp
    try {
      const rect = e?.currentTarget?.getBoundingClientRect?.();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 22,
        spread: 45,
        startVelocity: 18,
        origin: { x: originX, y: originY },
        colors: [letter.sealColor || '#FFD6D6', '#D4F1FF', '#FFEE8C', '#C8F7DC'],
        disableForReducedMotion: true,
        scalar: 0.75,
      });
    } catch {
      // safe fallback
    }

    onOpenLetter(letter);
  };

  // Organic slight tilts for realism
  const tilts = ['-2deg', '1.5deg', '-1deg', '2deg'];
  const tilt = tilts[index % tilts.length];

  return (
    <div
      className="relative select-none py-3"
      style={{ transform: `rotate(${tilt})` }}
    >
      {/* Envelope Card Body */}
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={(e) => handleOpen(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen(e);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Open letter from ${letter.author} to ${recipient}`}
        className={`relative w-[280px] xs:w-72 md:w-80 max-w-[calc(100vw-2.5rem)] h-52 rounded-xl p-4 cursor-pointer shadow-paper transition-shadow duration-300 hover:shadow-paper-hover border border-slateAsh/15 overflow-hidden ${letter.envelopeColor || 'bg-skyMist'
          }`}
      >
        {/* Pinned washi tape in corner */}
        <div
          className="washi-tape absolute -top-1.5 right-6 w-20 h-5 bg-white/80 z-20 rounded-xs rotate-3 border border-slateAsh/10"
        />
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
          {isRead && (
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 text-slateAsh text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border border-slateAsh/20 shadow-xs flex items-center gap-0.5 whitespace-nowrap">
              <Check className="w-2.5 h-2.5 text-pastelCoral" /> read
            </span>
          )}
        </div>

        {/* Addressing area */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="border-b border-dashed border-slateAsh/25 pb-1 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-slateAsh/60 block">
              To:
            </span>
            <span className="font-handwriting text-2xl text-slateAsh font-bold truncate block">
              {recipient}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slateAsh/80">
            <span className="font-sans font-medium flex items-center gap-1 truncate max-w-[170px]">
              From: <strong className="font-bold text-slateAsh">{letter.author}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {(letter?.audioUrl || letter?.audio) && (
                <span 
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono text-slateAsh/80 bg-white/80 px-1.5 py-0.5 rounded-full border border-slateAsh/15"
                  title="Includes audio note / song"
                >
                  <Volume2 className="w-2.5 h-2.5 text-pastelCoral" />
                  <span>audio</span>
                </span>
              )}
              {hasImages && (
                <span 
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono text-slateAsh/70 bg-white/70 px-1.5 py-0.5 rounded-full border border-slateAsh/15"
                  title="Contains photo/image attachments"
                >
                  <ImageIcon className="w-2.5 h-2.5" />
                  <span>photo</span>
                </span>
              )}
              <span className="text-xs font-mono text-slateAsh/60 bg-white/60 px-2 py-0.5 rounded-full border border-slateAsh/10">
                {letter.date}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div
          className={`absolute inset-0 bg-white/20 backdrop-blur-[0.5px] z-30 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="bg-white/90 text-slateAsh text-xs font-semibold px-3 py-1.5 rounded-full shadow-paper-sm border border-slateAsh/15 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-coralBlush" />
            {isRead ? 'Click to re-read' : 'Click to open'}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
