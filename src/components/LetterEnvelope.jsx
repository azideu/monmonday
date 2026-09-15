import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Image as ImageIcon, Volume2, Check, PenTool, FileText, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import IconRenderer from './IconRenderer.jsx';

export default function LetterEnvelope({ letter, onOpenLetter, index, defaultRecipient = "Monmonkyu", isRead = false, isLocked = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const recipient = letter?.recipientNickname || letter?.recipient || letter?.to || defaultRecipient;
  
  const isHandwritten = letter?.type === 'handwritten' || Boolean(letter?.handwrittenImageUrl || letter?.scanUrl);
  const handwrittenImgUrl = letter?.handwrittenImageUrl || letter?.scanUrl;

  // Photo attachments (excluding the handwritten scan itself)
  const hasPhotoAttachments = Boolean(
    letter?.imageUrl ||
    letter?.image ||
    (Array.isArray(letter?.images) && letter.images.some((img) => {
      const url = typeof img === 'string' ? img : img?.url;
      return url && url !== handwrittenImgUrl && !img?.isScan;
    }))
  );

  const handleOpen = (e) => {
    e?.stopPropagation?.();

    // Gentle pastel confetti sparkle on unsealing the wax stamp (only if already unlocked)
    if (!isLocked) {
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
    }

    onOpenLetter(letter);
  };

  // Organic slight tilts for realism
  const tilts = ['-2deg', '1.5deg', '-1deg', '2deg'];
  const tilt = tilts[index % tilts.length];

  return (
    <div
      className="relative select-none pt-5 pb-3"
      style={{ transform: `rotate(${tilt})` }}
    >
      {/* Envelope Card Body */}
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={(e) => handleOpen(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen(e);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Open ${isLocked ? 'secret locked' : isHandwritten ? 'handwritten' : 'typed'} letter from ${letter.author} to ${recipient}`}
        className={`relative w-[280px] xs:w-72 md:w-80 max-w-[calc(100vw-2.5rem)] h-52 rounded-xl p-4 cursor-pointer shadow-paper transition-shadow duration-300 hover:shadow-paper-hover border border-slateAsh/15 ${
          letter.envelopeColor || 'bg-skyMist'
        }`}
      >
        {/* Pinned washi tape in corner */}
        <div
          className="washi-tape absolute -top-1.5 right-6 w-20 h-5 bg-white/80 z-20 rounded-xs rotate-3 border border-slateAsh/10"
        />

        {/* Peeking Letter Paper inside the Envelope Pocket */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -16 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="absolute left-4 top-2 w-20 h-[80px] bg-[#FFFDF9] rounded-t-lg shadow-paper-sm border border-slateAsh/20 z-5 overflow-hidden pointer-events-none"
        >
          {isLocked ? (
            /* Confidential Mystery Riddle Slip */
            <div className="w-full h-full p-1.5 bg-[#FFF9E6] border-b border-[#ECD9A0] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-6 h-1 bg-[#FFD6D6] rounded-xs -rotate-2 border border-slateAsh/15" />
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slateAsh/80 bg-white/90 px-1 py-0.2 rounded border border-slateAsh/15 scale-90 origin-right">
                    <Lock className="w-2.5 h-2.5 text-[#E56B6F]" />
                    <span>SECRET</span>
                  </span>
                </div>
                <p className="font-handwriting text-xs text-slateAsh/80 leading-tight mt-1 line-clamp-2">
                  "{letter.passwordHint || "Locked with secret passcode"}"
                </p>
              </div>
              <span className="text-[10px] font-mono text-slateAsh/50 text-center block tracking-wider uppercase scale-90 origin-center">
                Click to unlock
              </span>
            </div>
          ) : isHandwritten ? (
            /* Handwritten paper preview */
            handwrittenImgUrl ? (
              <div className="w-full h-full p-1.5 flex flex-col items-center">
                <div className="w-8 h-1.5 bg-buttercup/90 rounded-xs -rotate-2 mb-1 border border-slateAsh/15 shrink-0" />
                <img
                  src={handwrittenImgUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-12 object-cover object-top rounded-xs opacity-90 filter contrast-105"
                />
              </div>
            ) : (
              <div className="w-full h-full p-2 flex flex-col gap-1">
                <div className="w-8 h-1.5 bg-coralBlush/90 rounded-xs -rotate-2 border border-slateAsh/15 shrink-0" />
                <div className="space-y-1 pt-0.5 opacity-50">
                  <div className="w-3/4 h-1 bg-slateAsh/50 rounded-full" />
                  <div className="w-5/6 h-1 bg-slateAsh/40 rounded-full" />
                  <div className="w-2/3 h-1 bg-slateAsh/40 rounded-full" />
                </div>
              </div>
            )
          ) : (
            /* Typed lined stationery preview */
            <div className="w-full h-full p-2 lined-paper flex flex-col gap-1">
              <div className="w-8 h-1.5 bg-skyMist/90 rounded-xs rotate-1 border border-slateAsh/15 shrink-0" />
              <div className="space-y-1.5 pt-1 opacity-55">
                <div className="w-11/12 h-1 bg-slateAsh/50 rounded-full" />
                <div className="w-4/5 h-1 bg-slateAsh/40 rounded-full" />
                <div className="w-2/3 h-1 bg-slateAsh/40 rounded-full" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Envelope Flap Lines Geometry */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Flap Triangle with dynamic unsealing lift */}
          <motion.div
            animate={{ 
              y: isHovered ? -4 : 0,
              scaleY: isHovered ? 0.94 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="absolute top-0 left-0 right-0 h-[104px] bg-white/25 border-b border-slateAsh/15 origin-top z-15"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />
          {/* Bottom Flap Triangle */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[104px] bg-white/10 rounded-b-xl z-10"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
            }}
          />
        </div>

        {/* Vintage Airmail Postage Stamp */}
        <div className="absolute top-3 right-3 z-20 w-12 h-14 bg-white rounded border border-dashed border-slateAsh/40 p-1 flex flex-col items-center justify-between shadow-paper-sm">
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

        {/* Wax Seal centered on the envelope flap junction */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.08 : 1, 
              y: isHovered ? -3 : 0 
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative pointer-events-auto"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 border-white/60 relative cursor-pointer"
              style={{ backgroundColor: isLocked ? '#FFEE8C' : (letter.sealColor || '#FFD6D6') }}
            >
              <IconRenderer 
                name={isLocked ? "lock" : letter.sealIcon} 
                className="w-5 h-5 text-slateAsh filter drop-shadow-sm" 
                fallback={isLocked ? "lock" : "heart"} 
                strokeWidth={2} 
              />
              {/* Wax rim detail */}
              <div className="absolute inset-0.5 rounded-full border border-slateAsh/15 pointer-events-none" />
            </div>
            {isRead && !isLocked && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 text-slateAsh text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border border-slateAsh/20 shadow-xs flex items-center gap-0.5 whitespace-nowrap">
                <Check className="w-2.5 h-2.5 text-pastelCoral" /> read
              </span>
            )}
          </motion.div>
        </div>

        {/* Addressing area */}
        <div className="absolute bottom-3 left-4 right-4 z-20">
          <div className="border-b border-dashed border-slateAsh/25 pb-1 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-slateAsh/60 block">
              To:
            </span>
            <span className="font-handwriting text-2xl text-slateAsh font-bold truncate block">
              {recipient}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slateAsh/80 gap-1.5">
            <span className="font-sans font-medium flex items-center gap-1 truncate shrink min-w-0">
              From: <strong className="font-bold text-slateAsh truncate">{letter.author}</strong>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {(letter?.audioUrl || letter?.audio) && (
                <span 
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono text-slateAsh/80 bg-white/85 px-1.5 py-0.5 rounded-full border border-slateAsh/15"
                  title="Includes audio note / song"
                >
                  <Volume2 className="w-2.5 h-2.5 text-pastelCoral" />
                  <span className="hidden xs:inline">audio</span>
                </span>
              )}
              {hasPhotoAttachments && (
                <span 
                  className="inline-flex items-center gap-0.5 text-[10px] font-mono text-slateAsh/70 bg-white/80 px-1.5 py-0.5 rounded-full border border-slateAsh/15"
                  title="Contains photo attachment(s)"
                >
                  <ImageIcon className="w-2.5 h-2.5" />
                  <span className="hidden xs:inline">photo</span>
                </span>
              )}
              {isLocked ? (
                <span 
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slateAsh bg-white/95 px-2 py-0.5 rounded-full border border-slateAsh/20 shadow-2xs"
                  title="Secret password-protected letter"
                >
                  <Lock className="w-2.5 h-2.5 text-[#E56B6F]" strokeWidth={2.2} />
                  <span>Secret</span>
                </span>
              ) : isHandwritten ? (
                <span 
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slateAsh bg-white/95 px-2 py-0.5 rounded-full border border-slateAsh/20 shadow-2xs"
                  title="Handwritten letter"
                >
                  <PenTool className="w-2.5 h-2.5 text-[#E56B6F]" strokeWidth={2.2} />
                  <span>Handwritten</span>
                </span>
              ) : (
                <span 
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-slateAsh/70 bg-white/80 px-1.5 py-0.5 rounded-full border border-slateAsh/15"
                  title="Typed letter"
                >
                  <FileText className="w-2.5 h-2.5 text-slateAsh/60" strokeWidth={1.8} />
                  <span>Typed</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover Hint Overlay: Floating pill without blurring the peeking paper */}
        <div
          className={`absolute bottom-14 left-1/2 -translate-x-1/2 z-30 transition-all duration-200 pointer-events-none ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="bg-white/95 text-slateAsh text-xs font-semibold px-3 py-1.5 rounded-full shadow-paper border border-slateAsh/15 flex items-center gap-1.5 whitespace-nowrap">
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-[#E56B6F]" />
                <span>Click to unlock</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-coralBlush" />
                <span>{isRead ? 'Click to re-read' : 'Click to open'}</span>
              </>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
