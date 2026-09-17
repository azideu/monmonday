import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Pin,
  Camera,
  X,
  Send,
  PartyPopper,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Flame,
  Flower2,
  Bookmark,
  Smile,
  Disc,
} from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { playPaperRustle, playDeckClick } from '../utils/soundEffects.js';

/**
 * MobileKeepsakesTray
 *
 * Adapts the desktop side scrapbook margins for mobile and tablet screens (<1280px).
 * Instead of hiding all side ephemera and photos on mobile devices, this component
 * arranges them into a touch-friendly, horizontal swipeable keepsake ribbon
 * with full interactive 3D polaroid flips, party cannons, and sound effects.
 */
export default function MobileKeepsakesTray({ leftItems = [], rightItems = [] }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flyingPlaneIdx, setFlyingPlaneIdx] = useState(null);

  // Combine unique items from left and right margins
  const allItems = React.useMemo(() => {
    return [...(leftItems || []), ...(rightItems || [])];
  }, [leftItems, rightItems]);

  const photoItems = React.useMemo(() => {
    return allItems.filter((item) => item.type === 'photo');
  }, [allItems]);

  const currentPhotoIndex = photoItems.findIndex((item) => item === activePhoto);

  const handleOpenPhoto = (item, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActivePhoto(item);
    setIsFlipped(false);
    playPaperRustle();

    try {
      const rect = e?.currentTarget?.getBoundingClientRect?.();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 16,
        spread: 45,
        startVelocity: 16,
        origin: { x: originX, y: originY },
        colors: ['#D4F1FF', '#FFEE8C', '#FFD6D6', '#C8F7DC', '#E5DBFF'],
        disableForReducedMotion: true,
        scalar: 0.7,
      });
    } catch {}
  };

  const handleClose = () => {
    playPaperRustle();
    setActivePhoto(null);
    setIsFlipped(false);
  };

  const handleToggleFlip = (e) => {
    e?.stopPropagation?.();
    playPaperRustle();
    setIsFlipped((prev) => !prev);
  };

  const handlePrevPhoto = (e) => {
    e?.stopPropagation?.();
    if (currentPhotoIndex > 0) {
      playPaperRustle();
      setActivePhoto(photoItems[currentPhotoIndex - 1]);
      setIsFlipped(false);
    }
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation?.();
    if (currentPhotoIndex < photoItems.length - 1) {
      playPaperRustle();
      setActivePhoto(photoItems[currentPhotoIndex + 1]);
      setIsFlipped(false);
    }
  };

  const handlePopConfetti = (e) => {
    e?.stopPropagation?.();
    playDeckClick();
    try {
      const rect = e?.currentTarget?.getBoundingClientRect?.();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.7;

      confetti({
        particleCount: 42,
        spread: 70,
        startVelocity: 24,
        origin: { x: originX, y: originY },
        colors: ['#D4F1FF', '#FFEE8C', '#C8F7DC', '#FFD6D6', '#E5DBFF'],
        disableForReducedMotion: true,
        scalar: 0.85,
      });
    } catch {}
  };

  const handleFlyPlane = (idx, e) => {
    e?.stopPropagation?.();
    playPaperRustle();
    setFlyingPlaneIdx(idx);
    setTimeout(() => {
      setFlyingPlaneIdx(null);
    }, 1200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePhoto) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentPhotoIndex > 0) {
          playPaperRustle();
          setActivePhoto(photoItems[currentPhotoIndex - 1]);
          setIsFlipped(false);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentPhotoIndex < photoItems.length - 1) {
          playPaperRustle();
          setActivePhoto(photoItems[currentPhotoIndex + 1]);
          setIsFlipped(false);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        playPaperRustle();
        setIsFlipped((prev) => !prev);
      }
    };

    if (activePhoto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto, currentPhotoIndex, photoItems]);

  if (!allItems || allItems.length === 0) return null;

  return (
    <section className="xl:hidden w-full my-10 select-none" aria-label="Desk keepsakes and snapshots">
      {/* Section Header */}
      <div className="text-center mb-5 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skyMist/60 text-slateAsh text-xs font-mono font-bold border border-skyMist mb-2">
          <Sparkles className="w-3.5 h-3.5 text-slateAsh fill-buttercup" />
          <span>DESK KEEPSAKES</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-serifDisplay">
          Snapshots & ephemera
        </h3>
        <p className="text-xs sm:text-sm text-slateAsh/70 mt-1 font-sans max-w-md mx-auto">
          Swipe sideways to explore tickets, doodles, and candid moments around the desk. Tap any photo to flip it.
        </p>
      </div>

      {/* Horizontal Touch Scroll Shelf */}
      <div className="relative">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 px-4 sm:px-6 snap-x snap-mandatory overscroll-x-contain [-webkit-overflow-scrolling:touch]">
          {allItems.map((item, idx) => {
            // 1. Photo item
            if (item.type === 'photo') {
              const hasRealImage = Boolean(item.imageUrl);
              return (
                <div
                  key={idx}
                  className="snap-start shrink-0 select-none"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                >
                  <motion.div
                    role="button"
                    tabIndex={0}
                    whileTap={{ scale: 0.95 }}
                    className="w-48 sm:w-52 bg-white p-3 pb-4 rounded-xl shadow-paper border border-slateAsh/15 cursor-pointer relative group focus:outline-none focus:ring-2 focus:ring-skyMist"
                    onClick={(e) => handleOpenPhoto(item, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenPhoto(item, e);
                      }
                    }}
                    title={item.caption || "Click to open memory"}
                    aria-label={`View ${item.caption || 'photo memory'}`}
                  >
                    {/* Washi tape on top */}
                    <div
                      className={`washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 ${
                        item.tapeColor || 'bg-skyMist/85'
                      } z-10 rounded-xs border border-slateAsh/10`}
                    />

                    {/* Photo area */}
                    <div className="relative w-full aspect-square bg-[#F8FBFE] rounded-lg overflow-hidden flex flex-col items-center justify-center border border-dashed border-slateAsh/20 p-2 shadow-inner">
                      {hasRealImage ? (
                        <img
                          src={item.imageUrl}
                          alt={item.caption || "Scrapbook photo"}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-1 w-full h-full bg-skyMist/15 rounded p-1.5">
                          <IconRenderer
                            name={item.illustration || "camera"}
                            className="w-5 h-5 text-slateAsh/80"
                            fallback="camera"
                          />
                          <span className="text-[10px] font-handwriting text-slateAsh/80 font-bold leading-none px-1 truncate max-w-full">
                            {item.illustrationText || item.caption || "snapshot"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Caption */}
                    {item.caption && (
                      <p className="font-handwriting text-base text-slateAsh text-center mt-2 leading-tight truncate">
                        {item.caption}
                      </p>
                    )}

                    {/* Attached note preview */}
                    {item.note && (
                      <p className="font-sans text-[10px] text-slateAsh/60 text-center italic mt-1 line-clamp-1 border-t border-dashed border-slateAsh/15 pt-1">
                        "{item.note}"
                      </p>
                    )}
                  </motion.div>
                </div>
              );
            }

            // 2. Ticket
            if (item.type === 'ticket') {
              return (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-44 bg-cloudWhite p-3.5 rounded-xl shadow-paper border border-dashed border-slateAsh/30 relative"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                >
                  <div className="flex items-center justify-between border-b border-dashed border-slateAsh/25 pb-1 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slateAsh/60">
                      {item.category || "ADMIT ONE"}
                    </span>
                    <span className="text-[10px] font-mono text-slateAsh/70 font-bold">
                      {item.number || "№ 0918"}
                    </span>
                  </div>
                  <p className="font-handwriting text-base text-slateAsh leading-tight font-bold">
                    {item.title}
                  </p>
                  <p className="text-xs font-sans text-slateAsh/70 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              );
            }

            // 3. Origami Paper Airplane
            if (item.type === 'paper-plane') {
              const isFlying = flyingPlaneIdx === idx;
              return (
                <motion.div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                  animate={isFlying ? {
                    x: [0, 20, 0],
                    y: [0, -12, 0],
                    rotate: [0, 10, 0],
                  } : {}}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => handleFlyPlane(idx, e)}
                  className="snap-start shrink-0 w-44 p-3 bg-white/90 rounded-xl shadow-paper border border-slateAsh/15 cursor-pointer flex items-center gap-2.5"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                  title="Tap to glide paper plane"
                >
                  <div className="w-8 h-8 rounded-full bg-skyMist flex items-center justify-center text-slateAsh shrink-0 border border-skyMist/80">
                    <Send className="w-4 h-4 -rotate-45 ml-0.5" />
                  </div>
                  <div>
                    <p className="font-handwriting text-sm text-slateAsh font-bold leading-tight flex items-center gap-1">
                      <span>{item.title || "Paper Glider"}</span>
                      <Sparkles className="w-3 h-3 text-buttercup fill-buttercup" />
                    </p>
                    <p className="text-[10px] font-sans text-slateAsh/70">
                      {item.subtitle || "Fly high this year ✨"}
                    </p>
                  </div>
                </motion.div>
              );
            }

            // 4. Confetti Party Popper
            if (item.type === 'confetti-popper') {
              return (
                <motion.div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => handlePopConfetti(e)}
                  className="snap-start shrink-0 w-44 bg-pastelMint/40 p-3 rounded-xl shadow-paper border border-pastelMint/60 flex items-center gap-2.5 cursor-pointer"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                  title="Tap to pop confetti!"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-2xs border border-slateAsh/10 shrink-0">
                    <PartyPopper className="w-4 h-4 text-coralBlush animate-pulse" />
                  </div>
                  <div>
                    <p className="font-handwriting text-sm text-slateAsh font-bold leading-tight flex items-center gap-1">
                      <span>{item.title || "Party Cannon"}</span>
                      <span className="text-[10px] bg-white/90 px-1 py-0.2 rounded-full font-mono text-slateAsh/70 border border-slateAsh/15 font-bold">POP!</span>
                    </p>
                    <p className="text-[10px] font-sans text-slateAsh/70">
                      {item.subtitle || "Pop for 22 years of you!"}
                    </p>
                  </div>
                </motion.div>
              );
            }

            // 5. Pressed Flower or Botanical
            if (item.type === 'pressed-flower') {
              return (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-44 bg-white/90 p-3 rounded-xl shadow-paper border border-slateAsh/15 flex items-center gap-2.5"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                >
                  <div className="w-8 h-8 rounded-full bg-pastelMint/40 flex items-center justify-center text-slateAsh shrink-0 border border-pastelMint/60">
                    <Flower2 className="w-4 h-4 text-slateAsh/80" />
                  </div>
                  <div>
                    <p className="font-handwriting text-sm text-slateAsh font-bold leading-tight">
                      {item.title || "Botanical"}
                    </p>
                    <p className="text-[10px] font-sans text-slateAsh/60">
                      {item.subtitle || "Preserved keepsake"}
                    </p>
                  </div>
                </div>
              );
            }

            // 6. Sticky Note
            if (item.type === 'note') {
              return (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-44 bg-buttercup/40 p-3.5 rounded-xl shadow-paper border border-buttercup/60"
                  style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slateAsh/60 font-mono mb-1">
                    <Pin className="w-3 h-3 text-coralBlush" />
                    <span>memo</span>
                  </div>
                  <p className="font-handwriting text-sm text-slateAsh leading-snug">
                    "{item.text}"
                  </p>
                  {item.author && (
                    <span className="block text-right font-handwriting text-xs text-slateAsh/70 mt-1">
                      — {item.author}
                    </span>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Lightbox for zooming photos on mobile - Portaled to document.body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activePhoto && (
            <div
              className="fixed inset-0 z-[100] isolate flex items-center justify-center p-4 select-none overscroll-contain touch-none"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged photo memory"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-slateAsh/65 backdrop-blur-xs cursor-pointer"
                onClick={handleClose}
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                aria-hidden="true"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', damping: 25, stiffness: 280 },
                }}
                exit={{ opacity: 0, scale: 0.88, y: 20, transition: { duration: 0.2 } }}
                className="relative max-w-md w-full perspective-1000 my-auto cursor-default z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 3D Flipping Card Body */}
                <div
                  className={`relative w-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-paper-elevated border-2 border-slateAsh/20 min-h-[460px] ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  <div className="washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-buttercup/90 z-30 -rotate-1 rounded-xs border border-slateAsh/15 shadow-2xs pointer-events-none" />

                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full bg-white p-5 rounded-2xl flex flex-col justify-between backface-hidden">
                    <div className="flex items-center justify-between z-20 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slateAsh/70 bg-skyMist/40 px-2.5 py-1 rounded-full border border-skyMist">
                        <Camera className="w-3 h-3 text-slateAsh" />
                        <span>KEEPSAKE MEMORY</span>
                        {photoItems.length > 1 && (
                          <span className="text-slateAsh/40">
                            • {currentPhotoIndex + 1}/{photoItems.length}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleClose}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-cloudWhite hover:bg-white text-slateAsh/70 hover:text-slateAsh shadow-paper-sm border border-slateAsh/15 cursor-pointer transition-colors"
                        aria-label="Close memory preview"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className="relative w-full aspect-square bg-[#F8FBFE] rounded-xl overflow-hidden flex flex-col items-center justify-center border border-dashed border-slateAsh/25 p-3 shadow-inner cursor-pointer"
                      onClick={handleToggleFlip}
                      title="Tap to flip and read note on back"
                    >
                      {activePhoto.imageUrl ? (
                        <img
                          src={activePhoto.imageUrl}
                          alt={activePhoto.caption || "Scrapbook photo"}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center p-6 text-center bg-skyMist/15">
                          <IconRenderer
                            name={activePhoto.illustration || 'camera'}
                            className="w-8 h-8 text-slateAsh/80 mb-2"
                            fallback="camera"
                          />
                          <span className="text-xs font-mono uppercase tracking-wider text-slateAsh/60">
                            Keepsake Snapshot
                          </span>
                        </div>
                      )}

                      {activePhoto.note && (
                        <div className="absolute bottom-2.5 right-2.5 bg-slateAsh/85 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-paper-sm border border-white/20">
                          <RotateCw className="w-3 h-3" />
                          <span className="text-xs font-sans">Tap to flip</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 flex flex-col items-center gap-2">
                      {activePhoto.caption && (
                        <h4 className="font-handwriting text-2xl font-bold text-slateAsh text-center leading-tight">
                          {activePhoto.caption}
                        </h4>
                      )}

                      {activePhoto.note && (
                        <button
                          onClick={handleToggleFlip}
                          className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-buttercup/50 hover:bg-buttercup/75 min-h-[44px] px-4 py-2 rounded-full border border-buttercup/90 shadow-paper-sm transition-all cursor-pointer active:scale-95"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slateAsh" />
                          <span>Turn over to read note</span>
                        </button>
                      )}
                    </div>

                    <div className="mt-2 pt-2.5 border-t border-dashed border-slateAsh/15 flex items-center justify-between text-xs text-slateAsh/60 font-sans">
                      {photoItems.length > 1 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevPhoto}
                            disabled={currentPhotoIndex === 0}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-cloudWhite hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Previous memory"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-mono">
                            {currentPhotoIndex + 1} of {photoItems.length}
                          </span>
                          <button
                            onClick={handleNextPhoto}
                            disabled={currentPhotoIndex === photoItems.length - 1}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-cloudWhite hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Next memory"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-slateAsh/40">Scrapbook Moment</span>
                      )}

                      <button
                        onClick={handleClose}
                        className="text-xs font-mono text-slateAsh/60 underline p-2 min-h-[44px] flex items-center"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] lined-paper rounded-2xl p-5 flex flex-col justify-between rotate-y-180 backface-hidden border-2 border-slateAsh/15 shadow-inner-paper overflow-hidden">
                    <div className="washi-tape absolute -top-2 right-8 w-20 h-5 bg-skyMist/80 -rotate-3 rounded-xs border border-slateAsh/10 pointer-events-none" />

                    <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-2 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-coralBlush/40 flex items-center justify-center border border-coralBlush/60">
                          <Pin className="w-3.5 h-3.5 text-coralBlush" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slateAsh/60 block leading-tight">
                            Personal Memory Note
                          </span>
                          <span className="text-xs font-mono font-bold text-slateAsh/80">
                            № 0918 • Mon's 22nd
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleClose}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white hover:bg-cloudWhite text-slateAsh/70 hover:text-slateAsh shadow-paper-sm border border-slateAsh/15 cursor-pointer transition-colors"
                        aria-label="Close memory preview"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className="my-auto py-4 px-2 flex flex-col items-center justify-center text-center cursor-pointer"
                      onClick={handleToggleFlip}
                    >
                      <div className="relative max-w-sm mx-auto bg-buttercup/20 border border-dashed border-buttercup/80 rounded-2xl p-5 shadow-paper-sm">
                        <p className="font-handwriting text-2xl text-slateAsh font-medium leading-relaxed">
                          "{activePhoto.note || activePhoto.caption || "A sweet memory preserved on your special day."}"
                        </p>
                        {activePhoto.caption && activePhoto.note && (
                          <span className="font-handwriting text-base text-slateAsh/70 block mt-2 text-right">
                            — on {activePhoto.caption}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-dashed border-slateAsh/20 flex items-center justify-between z-10">
                      <button
                        onClick={handleToggleFlip}
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-skyMist/70 hover:bg-skyMist min-h-[44px] px-4 py-2 rounded-full border border-skyMist/90 shadow-paper-sm transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-slateAsh" />
                        <span>Flip to photo</span>
                      </button>

                      {photoItems.length > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handlePrevPhoto}
                            disabled={currentPhotoIndex === 0}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-white hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Previous memory"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleNextPhoto}
                            disabled={currentPhotoIndex === photoItems.length - 1}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-white hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Next memory"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
