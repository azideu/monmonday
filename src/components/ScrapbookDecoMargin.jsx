import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  Pin,
  Camera,
  Star,
  Music,
  Coffee,
  X,
  Clover,
  Flame,
  Send,
  Disc,
  Smile,
  Leaf,
  Flower2,
  Bookmark,
  PartyPopper,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { playPaperRustle, playDeckClick } from '../utils/soundEffects.js';

/**
 * Pinned desktop side decoration margin with rich stationery ephemera,
 * running continuously from the hero header down to the bottom of the page.
 */
export default function ScrapbookDecoMargin({ side = "left", items = [] }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flyingPlaneIdx, setFlyingPlaneIdx] = useState(null);

  const photoItems = items.filter((item) => item.type === 'photo');
  const currentPhotoIndex = photoItems.findIndex((item) => item === activePhoto);

  const handleOpenPhoto = (item, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setActivePhoto(item);
    setIsFlipped(false);
    playPaperRustle();

    // Gentle pastel confetti sparkle on unpinning
    try {
      const rect = e?.currentTarget?.getBoundingClientRect?.();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : (side === 'left' ? 0.15 : 0.85);
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.45;

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
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : (side === 'left' ? 0.15 : 0.85);
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.75;

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

  if (!items || items.length === 0) return null;


  return (
    <>
      <aside
        aria-label={`${side} decorative scrapbook margins`}
        className={`hidden xl:flex flex-col gap-8 2xl:gap-10 absolute top-24 pb-12 ${side === 'left' ? 'left-2 2xl:left-5 3xl:left-12' : 'right-2 2xl:right-5 3xl:right-12'
          } w-44 2xl:w-52 3xl:w-60 pointer-events-auto select-none z-10`}
      >
        {items.map((item, idx) => {
          // 1. Photo item (with support for real photo or illustrated snapshot sketch)
          if (item.type === 'photo') {
            const hasRealImage = Boolean(item.imageUrl);
            return (
              <div
                key={idx}
                className="relative select-none"
                style={{ transform: `rotate(${item.rotation || '0deg'})` }}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  className="relative group bg-white p-2.5 pb-4 rounded-md shadow-paper border border-slateAsh/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-skyMist select-none"
                  onMouseDown={(e) => {
                    // Prevent focus jump or horizontal scroll shift on click
                    e.preventDefault();
                  }}
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
                    className={`washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-14 2xl:w-16 h-3.5 2xl:h-4 ${item.tapeColor || 'bg-skyMist/85'
                      } z-10 rounded-xs border border-slateAsh/10`}
                  />

                  {/* Pushpin dot */}
                  <div className="absolute -top-1 left-2.5 w-2.5 h-2.5 rounded-full bg-coralBlush shadow-xs border border-white" />

                  {/* Photo Area */}
                  <div className="relative w-full aspect-square bg-[#F8FBFE] rounded overflow-hidden flex flex-col items-center justify-center border border-dashed border-slateAsh/20 p-2">
                    {hasRealImage ? (
                      <img
                        src={item.imageUrl}
                        alt={item.caption || "Scrapbook photo"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      // Illustrated sketch fallback so empty slots feel like artistic memories
                      <div className="flex flex-col items-center justify-center text-center gap-1.5 w-full h-full bg-skyMist/15 rounded p-1.5">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-xs border border-slateAsh/15 text-slateAsh">
                          <IconRenderer
                            name={item.illustration || "camera"}
                            className="w-4.5 h-4.5 text-slateAsh/80"
                            fallback="camera"
                          />
                        </div>
                        <span className="text-[10px] font-handwriting text-slateAsh/80 font-bold leading-none px-1 truncate max-w-full">
                          {item.illustrationText || item.caption || "snapshot"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  {item.caption && (
                    <p className="font-handwriting text-sm 2xl:text-base text-slateAsh text-center mt-2 leading-tight">
                      {item.caption}
                    </p>
                  )}

                  {/* Attached Note Preview on the margin card */}
                  {item.note && (
                    <div className="mt-1.5 pt-1.5 border-t border-dashed border-slateAsh/15 px-0.5">
                      <p className="font-sans text-[10px] text-slateAsh/70 text-center line-clamp-2 leading-snug italic">
                        "{item.note}"
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          }

          // 2. Vintage Admission / Voucher Ticket
          if (item.type === 'ticket') {
            return (
              <div
                key={idx}
                className={`relative bg-cloudWhite p-3 rounded shadow-paper border border-dashed border-slateAsh/30 ${item.rotation || '-rotate-3'} transition-transform hover:scale-105`}
              >
                {/* Vintage ticket notched edges */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#EBF7FD] border-r border-slateAsh/30" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#EBF7FD] border-l border-slateAsh/30" />

                <div className="flex items-center justify-between border-b border-dashed border-slateAsh/25 pb-1 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slateAsh/60">
                    {item.category || "ADMIT ONE"}
                  </span>
                  <span className="text-[10px] font-mono text-slateAsh/70 font-bold">
                    {item.number || "№ 0918"}
                  </span>
                </div>
                <p className="font-handwriting text-base 2xl:text-lg text-slateAsh leading-tight font-bold">
                  {item.title}
                </p>
                <p className="text-xs font-sans text-slateAsh/70 mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            );
          }

          // 3. Pinned Sticky Memo Note
          if (item.type === 'note') {
            return (
              <div
                key={idx}
                className={`relative bg-buttercup/40 p-3.5 rounded shadow-paper border border-buttercup/60 ${item.rotation || '-rotate-2'} transition-transform hover:scale-105`}
              >
                {/* Tape on corner */}
                <div className="washi-tape absolute -top-1.5 left-4 w-12 h-3.5 bg-white/80 rounded-xs -rotate-6 border border-slateAsh/10" />
                <div className="flex items-center gap-1.5 text-xs text-slateAsh/60 font-mono mb-1">
                  <Pin className="w-3 h-3 text-coralBlush" />
                  <span>memo</span>
                </div>
                <p className="font-handwriting text-base text-slateAsh leading-snug">
                  "{item.text}"
                </p>
                {item.author && (
                  <span className="block text-right font-handwriting text-xs text-slateAsh/70 mt-1.5">
                    — {item.author}
                  </span>
                )}
              </div>
            );
          }

          // 4. Pressed Botanical Specimen
          if (item.type === 'pressed-flower') {
            return (
              <div
                key={idx}
                className={`relative bg-white/95 p-3 rounded-lg shadow-paper border border-slateAsh/15 ${item.rotation || 'rotate-3'} transition-transform hover:scale-105`}
              >
                {/* Translucent botanical washi tape */}
                <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-pastelMint/80 rounded-xs border border-slateAsh/10 -rotate-2 z-10" />
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="w-9 h-9 rounded-full bg-pastelMint/30 flex items-center justify-center text-slateAsh border border-pastelMint">
                    {item.botanical === 'clover' ? (
                      <Clover className="w-5 h-5 text-emerald-600" />
                    ) : item.botanical === 'leaf' ? (
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Flower2 className="w-5 h-5 text-slateAsh" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slateAsh/60 block">
                      SPECIMEN
                    </span>
                    <p className="font-handwriting text-sm text-slateAsh font-bold leading-tight">
                      {item.title || "Pressed Daisy"}
                    </p>
                    <p className="text-[10px] font-mono text-slateAsh/60">
                      {item.subtitle || "Sep 18, 2026"}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // 5. Guitar Jam Pick
          if (item.type === 'guitar-pick') {
            return (
              <div
                key={idx}
                className={`relative self-center p-3 flex flex-col items-center justify-center ${item.rotation || '-rotate-6'} transition-transform hover:scale-110`}
              >
                {/* Washi tape pinning guitar pick */}
                <div className="washi-tape absolute -top-1 w-12 h-3.5 bg-buttercup/90 rounded-xs border border-slateAsh/10 z-10 rotate-3" />
                <div className="w-12 h-14 bg-skyMist border-2 border-slateAsh/30 rounded-t-2xl rounded-b-[40%] flex flex-col items-center justify-center p-1 shadow-paper-sm text-slateAsh">
                  <Music className="w-3.5 h-3.5 text-slateAsh mb-0.5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
                    {item.gauge || "MEDIUM"}
                  </span>
                  <span className="text-[10px] font-mono text-slateAsh/70">
                    {item.label || "AKARI"}
                  </span>
                </div>
                <span className="font-handwriting text-xs text-slateAsh mt-1 font-bold">
                  {item.caption || "Jam Pick"}
                </span>
              </div>
            );
          }

          // 6. Vintage Café Receipt
          if (item.type === 'receipt') {
            return (
              <div
                key={idx}
                className={`relative bg-cloudWhite p-3 rounded shadow-paper border border-slateAsh/20 font-mono text-[10px] text-slateAsh/80 ${item.rotation || 'rotate-2'} transition-transform hover:scale-105`}
              >
                {/* Tape */}
                <div className="washi-tape absolute -top-1.5 right-4 w-10 h-3 bg-coralBlush/80 rounded-xs -rotate-3 border border-slateAsh/10" />
                <div className="text-center border-b border-dashed border-slateAsh/25 pb-1 mb-1.5">
                  <p className="font-bold tracking-widest text-slateAsh text-[10px]">
                    ✦ MONMON CAFÉ ✦
                  </p>
                  <p className="text-[10px] text-slateAsh/60">ORDER #0918 • 22ND BDAY</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>1x Tiger Balm</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1x Bowl Of Pho</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-dashed border-slateAsh/25 pt-1 flex justify-between font-bold text-slateAsh">
                    <span>TOTAL:</span>
                    <span>FREE (BDAY!)</span>
                  </div>
                </div>
                <p className="font-handwriting text-xs text-center text-slateAsh/90 mt-2">
                  "Have the sweetest birthday! 🩵"
                </p>
              </div>
            );
          }

          // 7. Origami Paper Airplane
          if (item.type === 'paper-plane') {
            const isFlying = flyingPlaneIdx === idx;
            return (
              <motion.div
                key={idx}
                role="button"
                tabIndex={0}
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                animate={isFlying ? {
                  x: side === 'left' ? [0, 26, 0] : [0, -26, 0],
                  y: [0, -14, 0],
                  rotate: side === 'left' ? [-4, 12, -4] : [4, -12, 4],
                } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => handleFlyPlane(idx, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFlyPlane(idx, e);
                  }
                }}
                className={`relative flex items-center gap-2 p-2.5 bg-white/90 rounded-xl shadow-paper-sm border border-slateAsh/15 cursor-pointer select-none ${item.rotation || '-rotate-4'}`}
                title="Click to glide paper plane"
                aria-label="Glide paper plane"
              >
                <div className="w-8 h-8 rounded-full bg-skyMist flex items-center justify-center text-slateAsh shrink-0 border border-skyMist/80">
                  <Send className="w-4 h-4 -rotate-45 ml-0.5" />
                </div>
                <div className="overflow-hidden">
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

          // 8. Vintage Matchbook
          if (item.type === 'matchbook') {
            return (
              <div
                key={idx}
                className={`relative bg-coralBlush/60 p-3 rounded-md shadow-paper border border-coralBlush/80 ${item.rotation || 'rotate-4'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape absolute -top-1.5 left-3 w-10 h-3 bg-white/80 rounded-xs rotate-2 border border-slateAsh/10" />
                <div className="flex items-center gap-2 border-b border-slateAsh/15 pb-1 mb-1">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slateAsh uppercase">
                    LUCKY MATCHES
                  </span>
                </div>
                <p className="font-handwriting text-base text-slateAsh leading-tight font-bold">
                  {item.title || "Strike a Wish"}
                </p>
                <p className="text-[10px] font-sans text-slateAsh/70">
                  {item.subtitle || "For your 22nd birthday candles"}
                </p>
              </div>
            );
          }

          // 9. Retro Music / Vinyl Badge
          if (item.type === 'music-badge') {
            return (
              <div
                key={idx}
                className={`relative bg-white/95 p-3 rounded-xl shadow-paper border border-slateAsh/15 ${item.rotation || '-rotate-3'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-paleLilac/80 rounded-xs border border-slateAsh/10" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-7 h-7 rounded-full bg-[#2A3442] flex items-center justify-center text-amber-200 shrink-0">
                    <Disc className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-[10px] font-bold text-slateAsh truncate">
                      {item.track}
                    </p>
                    <p className="font-sans text-[10px] text-slateAsh/60 truncate">
                      {item.artist}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // 10. Stamp Cluster / Airmail Postmark
          if (item.type === 'stamp-cluster') {
            return (
              <div
                key={idx}
                className={`relative flex items-center justify-center p-2 ${item.rotation || 'rotate-6'}`}
              >
                <div className="relative w-24 2xl:w-28 h-28 2xl:h-32 bg-white rounded border border-dashed border-slateAsh/35 p-1.5 flex flex-col items-center justify-between shadow-paper-sm bg-[radial-gradient(#D4F1FF_1px,transparent_1px)] [background-size:8px_8px]">
                  <div className="w-full flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-bold text-slateAsh/60">AIR</span>
                    <span className="text-[10px] font-mono text-slateAsh/60">2026</span>
                  </div>
                  <div className="w-10 2xl:w-12 h-10 2xl:h-12 rounded-full bg-pastelMint/40 flex items-center justify-center border border-slateAsh/15">
                    <IconRenderer name={item.icon || "flower"} className="w-5 2xl:w-6 h-5 2xl:h-6 text-slateAsh/80" />
                  </div>
                  <span className="font-handwriting text-xs text-slateAsh font-bold tracking-wide">
                    {item.label || "Special Delivery"}
                  </span>
                </div>
                {/* Circular postmark stamp overlay */}
                <div className="absolute -bottom-2 -right-1 w-14 h-14 rounded-full border border-slateAsh/35 flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none opacity-60">
                  <span className="text-[10px] font-mono tracking-tighter text-slateAsh font-semibold">SEP 18</span>
                  <span className="text-[10px] font-mono tracking-tighter text-slateAsh">CELEBRATE</span>
                </div>
              </div>
            );
          }

          // 11. Die-Cut Sticker Badge
          if (item.type === 'sticker') {
            return (
              <div
                key={idx}
                className={`relative self-center p-3 rounded-2xl ${item.bgColor || 'bg-buttercup'} shadow-paper-sm border-2 border-dashed border-slateAsh/30 ${item.rotation || 'rotate-2'} transition-transform hover:scale-110`}
              >
                <div className="flex flex-col items-center justify-center text-center gap-1">
                  <IconRenderer name={item.icon || 'sparkles'} className="w-5 h-5 text-slateAsh" />
                  <span className="font-handwriting font-bold text-sm text-slateAsh uppercase tracking-wide">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] font-mono text-slateAsh/70">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // 12. Washi Tape Swatch Strip
          if (item.type === 'washi-swatch') {
            return (
              <div
                key={idx}
                className={`relative self-center py-2 flex flex-col gap-1.5 ${item.rotation || '-rotate-3'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape w-28 h-4 bg-skyMist/90 rounded-xs border border-slateAsh/15 rotate-1" />
                <div className="washi-tape w-32 h-4 bg-buttercup/90 rounded-xs border border-slateAsh/15 -rotate-2 ml-2" />
                <div className="washi-tape w-26 h-4 bg-coralBlush/90 rounded-xs border border-slateAsh/15 rotate-2" />
              </div>
            );
          }

          // 13. Guitar Chord Chart / Mixtape Scrap
          if (item.type === 'chord-chart') {
            return (
              <div
                key={idx}
                className={`relative bg-cloudWhite p-3 rounded-lg shadow-paper border border-slateAsh/15 ${item.rotation || 'rotate-2'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape absolute -top-1.5 left-3 w-10 h-3 bg-skyMist/80 rounded-xs rotate-1 border border-slateAsh/10" />
                <div className="flex items-center gap-1.5 text-xs text-slateAsh/70 font-mono mb-1">
                  <Music className="w-3.5 h-3.5 text-slateAsh" />
                  <span className="font-bold">{item.title || "Guitar Chords"}</span>
                </div>
                <div className="p-2 bg-white rounded border border-slateAsh/15 text-center my-1">
                  <span className="font-mono text-xs font-extrabold text-slateAsh tracking-widest">
                    {item.chords || "C • G • Am • F"}
                  </span>
                </div>
                <p className="text-[10px] font-sans text-slateAsh/60 text-center">
                  {item.subtitle || "Acoustic strumming in G"}
                </p>
              </div>
            );
          }

          // 14. Wishing Coin Medallion
          if (item.type === 'wish-coin') {
            return (
              <div
                key={idx}
                className={`relative self-center flex flex-col items-center justify-center p-2 ${item.rotation || '-rotate-2'} transition-transform hover:scale-110`}
              >
                <div className="w-14 h-14 rounded-full bg-buttercup border-2 border-dashed border-slateAsh/30 shadow-paper-sm flex flex-col items-center justify-center p-1">
                  <Sparkles className="w-4 h-4 text-slateAsh mb-0.5" />
                  <span className="text-[10px] font-mono font-bold text-slateAsh leading-none">
                    {item.year || "2026"}
                  </span>
                </div>
                <span className="font-handwriting text-xs text-slateAsh font-bold mt-1 text-center">
                  {item.title || "Wishing Coin"}
                </span>
                {item.caption && (
                  <span className="text-[10px] font-sans text-slateAsh/60 text-center">
                    {item.caption}
                  </span>
                )}
              </div>
            );
          }

          // 15. Handwritten Lyric Snippet Scrap
          if (item.type === 'lyric-snippet') {
            return (
              <div
                key={idx}
                className={`relative bg-[#FFFDF9] p-3 rounded shadow-paper border border-dashed border-slateAsh/25 ${item.rotation || 'rotate-3'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape absolute -top-1.5 right-4 w-12 h-3.5 bg-buttercup/80 rounded-xs -rotate-2 border border-slateAsh/10" />
                <span className="font-mono text-[10px] uppercase text-slateAsh/50 tracking-wider block mb-1">
                  {item.title || "Liner Notes"}
                </span>
                <p className="font-handwriting text-base text-slateAsh italic leading-snug">
                  "{item.lyrics || "Terukir di bintang... takkan pudar selamanya ✨"}"
                </p>
                {item.author && (
                  <span className="block text-right font-mono text-[10px] text-slateAsh/60 mt-1">
                    — {item.author}
                  </span>
                )}
              </div>
            );
          }

          // 16. Confetti Party Popper
          if (item.type === 'confetti-popper') {
            return (
              <motion.div
                key={idx}
                role="button"
                tabIndex={0}
                whileHover={{ scale: 1.08, rotate: 1 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => handlePopConfetti(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePopConfetti(e);
                  }
                }}
                className={`relative bg-pastelMint/40 p-3 rounded-xl shadow-paper-sm border border-pastelMint/60 ${item.rotation || '-rotate-3'} transition-transform flex items-center gap-2.5 cursor-pointer select-none`}
                title="Click to pop confetti cannon!"
                aria-label="Pop celebratory confetti cannon"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-2xs border border-slateAsh/10 shrink-0">
                  <PartyPopper className="w-4 h-4 text-coralBlush animate-pulse" />
                </div>
                <div>
                  <p className="font-handwriting text-sm text-slateAsh font-bold leading-tight flex items-center gap-1.5">
                    <span>{item.title || "Party Cannon"}</span>
                    <span className="text-[10px] bg-white/90 px-1.5 py-0.2 rounded-full font-mono text-slateAsh/70 border border-slateAsh/15 font-bold">POP!</span>
                  </p>
                  <p className="text-[10px] font-sans text-slateAsh/70">
                    {item.subtitle || "Pop for 22 years of you!"}
                  </p>
                </div>
              </motion.div>
            );
          }

          return null;
        })}
      </aside>

      {/* Lightbox for zooming margin photos & illustrated sketches - Portaled to document.body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activePhoto && (
            <div
              className="fixed inset-0 z-[100] isolate flex items-center justify-center p-4 sm:p-6 select-none overscroll-contain touch-none"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged photo memory"
            >
              {/* Soft Paper-toned Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 bg-slateAsh/65 backdrop-blur-xs cursor-pointer"
                onClick={handleClose}
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
                aria-hidden="true"
              />

              {/* Spatial 3D Floating Keepsake: Enters directly from the side where clicked */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.74,
                  x: side === 'left' ? -150 : 150,
                  y: 35,
                  rotate: side === 'left' ? -8 : 8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: -0.75,
                  transition: {
                    type: 'spring',
                    damping: 25,
                    stiffness: 270,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.76,
                  x: side === 'left' ? -120 : 120,
                  y: 20,
                  rotate: side === 'left' ? -6 : 6,
                  transition: {
                    duration: 0.22,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                className="relative max-w-md sm:max-w-lg w-full perspective-1000 my-auto cursor-default z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 3D Flipping Card Body */}
                <div
                  className={`relative w-full rounded-2xl transition-transform duration-700 transform-style-3d shadow-paper-elevated border-2 border-slateAsh/20 min-h-[460px] sm:min-h-[510px] ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Pinned washi tape across the top border */}
                  <div className="washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-buttercup/90 z-30 -rotate-1 rounded-xs border border-slateAsh/15 shadow-2xs pointer-events-none" />

                  {/* ── FRONT SIDE: The Photo Memory ── */}
                  <div className="absolute inset-0 w-full h-full bg-white p-5 sm:p-6 rounded-2xl flex flex-col justify-between backface-hidden">
                    {/* Top Action Bar */}
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
                        className="p-1.5 rounded-full bg-cloudWhite hover:bg-white text-slateAsh/70 hover:text-slateAsh shadow-paper-sm border border-slateAsh/15 cursor-pointer transition-colors"
                        aria-label="Close memory preview"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Viewport */}
                    <div
                      className="relative w-full aspect-4/3 sm:aspect-square bg-[#F8FBFE] rounded-xl overflow-hidden flex flex-col items-center justify-center border border-dashed border-slateAsh/25 p-3 shadow-inner group/viewport cursor-pointer"
                      onClick={handleToggleFlip}
                      title={activePhoto.note ? "Click to flip and read note on back" : "Memory snapshot"}
                    >
                      {activePhoto.imageUrl ? (
                        <img
                          src={activePhoto.imageUrl}
                          alt={activePhoto.caption || "Scrapbook photo"}
                          className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/viewport:scale-[1.02]"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Illustrated sketch fallback */}
                      <div
                        className={`w-full h-full rounded-lg flex flex-col items-center justify-center p-6 text-center bg-skyMist/15 ${
                          activePhoto.imageUrl ? 'hidden' : 'flex'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-paper-sm border border-slateAsh/15 mb-3 text-slateAsh">
                          <IconRenderer
                            name={activePhoto.illustration || 'camera'}
                            className="w-8 h-8 text-slateAsh/80"
                            fallback="camera"
                          />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-slateAsh/60">
                          Keepsake Snapshot
                        </span>
                      </div>

                      {/* Hover / Hint badge to flip */}
                      {activePhoto.note && (
                        <div className="absolute bottom-2.5 right-2.5 bg-slateAsh/85 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-paper-sm opacity-90 sm:opacity-0 sm:group-hover/viewport:opacity-100 transition-all backdrop-blur-xs border border-white/20 select-none">
                          <RotateCw className="w-3 h-3 animate-[spin_4s_linear_infinite]" />
                          <span className="text-xs font-sans">Flip to read note</span>
                        </div>
                      )}
                    </div>

                    {/* Caption & Flip Button */}
                    <div className="pt-3 flex flex-col items-center gap-2">
                      {activePhoto.caption && (
                        <h4 className="font-handwriting text-2xl sm:text-3xl font-bold text-slateAsh text-center leading-tight">
                          {activePhoto.caption}
                        </h4>
                      )}

                      {activePhoto.note && (
                        <button
                          onClick={handleToggleFlip}
                          className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-buttercup/50 hover:bg-buttercup/75 px-3.5 py-1.5 rounded-full border border-buttercup/90 shadow-paper-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Flip card to read handwritten note on back"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-slateAsh" />
                          <span>Turn over to read note</span>
                        </button>
                      )}
                    </div>

                    {/* Footer Nav Bar */}
                    <div className="mt-2 pt-2.5 border-t border-dashed border-slateAsh/15 flex items-center justify-between text-xs text-slateAsh/60 font-sans">
                      {photoItems.length > 1 ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handlePrevPhoto}
                            disabled={currentPhotoIndex === 0}
                            className="p-1 rounded-md bg-cloudWhite hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Previous memory"
                            title="Previous memory (Left Arrow)"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono">
                            {currentPhotoIndex + 1} of {photoItems.length}
                          </span>
                          <button
                            onClick={handleNextPhoto}
                            disabled={currentPhotoIndex === photoItems.length - 1}
                            className="p-1 rounded-md bg-cloudWhite hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                            aria-label="Next memory"
                            title="Next memory (Right Arrow)"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-slateAsh/40">Scrapbook Moment</span>
                      )}

                      <span className="text-xs font-mono text-slateAsh/50">
                        Esc to close
                      </span>
                    </div>
                  </div>

                  {/* ── BACK SIDE: The Handwritten Lined Note ── */}
                  <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] lined-paper rounded-2xl p-5 sm:p-7 flex flex-col justify-between rotate-y-180 backface-hidden border-2 border-slateAsh/15 shadow-inner-paper overflow-hidden">
                    {/* Washi tape on corner of back side */}
                    <div className="washi-tape absolute -top-2 right-8 w-20 h-5 bg-skyMist/80 -rotate-3 rounded-xs border border-slateAsh/10 pointer-events-none" />

                    {/* Back Header */}
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
                        className="p-1.5 rounded-full bg-white hover:bg-cloudWhite text-slateAsh/70 hover:text-slateAsh shadow-paper-sm border border-slateAsh/15 cursor-pointer transition-colors"
                        aria-label="Close memory preview"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Center Note Content in authentic Caveat handwriting */}
                    <div
                      className="my-auto py-6 px-3 sm:px-5 flex flex-col items-center justify-center text-center cursor-pointer"
                      onClick={handleToggleFlip}
                      title="Click to flip back to photo"
                    >
                      <div className="relative max-w-sm mx-auto bg-buttercup/20 border border-dashed border-buttercup/80 rounded-2xl p-5 sm:p-6 shadow-paper-sm">
                        <p className="font-handwriting text-2xl sm:text-3xl text-slateAsh font-medium leading-relaxed">
                          "{activePhoto.note || activePhoto.caption || "A sweet memory preserved on your special day."}"
                        </p>
                        {activePhoto.caption && activePhoto.note && (
                          <span className="font-handwriting text-lg text-slateAsh/70 block mt-3 text-right">
                            — on {activePhoto.caption}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Back Footer Controls */}
                    <div className="pt-3 border-t border-dashed border-slateAsh/20 flex items-center justify-between z-10">
                      <button
                        onClick={handleToggleFlip}
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-skyMist/70 hover:bg-skyMist px-3.5 py-1.5 rounded-full border border-skyMist/90 shadow-paper-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-slateAsh" />
                        <span>Flip back to photo</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {photoItems.length > 1 && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handlePrevPhoto}
                              disabled={currentPhotoIndex === 0}
                              className="p-1 rounded-md bg-white hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                              title="Previous memory"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleNextPhoto}
                              disabled={currentPhotoIndex === photoItems.length - 1}
                              className="p-1 rounded-md bg-white hover:bg-skyMist/40 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slateAsh/15 cursor-pointer"
                              title="Next memory"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

