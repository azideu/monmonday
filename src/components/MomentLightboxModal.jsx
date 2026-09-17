import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Pin,
  Camera,
} from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { playPaperRustle } from '../utils/soundEffects.js';

/**
 * Full-image expansion modal for central scrapbook moments.
 * - Perfectly centered card and photo (zero tape obstruction).
 * - Full-bleed dark backdrop that covers 100% of the screen including scrollbar gutters.
 * - Symmetrical floating chevron navigation controls.
 * - 3D card flip to view handwritten note on lined paper.
 */
export default function MomentLightboxModal({
  moment,
  isOpen,
  onClose,
  onPrev,
  onNext,
  currentIndex = 0,
  totalCount = 0,
  hasPrev = false,
  hasNext = false,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef(null);

  // Reset zoom and flip when active moment changes
  useEffect(() => {
    setIsFlipped(false);
    setZoomScale(1);
    setImgError(false);
  }, [moment?.id, moment?.imageUrl]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        playPaperRustle();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev && onPrev) {
          e.preventDefault();
          playPaperRustle();
          onPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (hasNext && onNext) {
          e.preventDefault();
          playPaperRustle();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose]);

  // Trap scroll and remove scrollbar-gutter so backdrop covers 100% of the screen edges
  useEffect(() => {
    if (!isOpen) return;

    const origHtmlOverflow = document.documentElement.style.overflow;
    const origHtmlGutter = document.documentElement.style.scrollbarGutter;
    const origBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarGutter = 'auto';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.documentElement.style.scrollbarGutter = origHtmlGutter;
      document.body.style.overflow = origBodyOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !moment) return null;

  const handleToggleFlip = (e) => {
    e?.stopPropagation?.();
    playPaperRustle();
    setIsFlipped((prev) => !prev);
  };

  const handleZoomIn = (e) => {
    e?.stopPropagation?.();
    setZoomScale((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation?.();
    setZoomScale((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
  };

  const handleResetZoom = (e) => {
    e?.stopPropagation?.();
    setZoomScale((prev) => (prev === 1 ? 1.5 : 1));
  };

  const handleDoubleTap = (e) => {
    e?.stopPropagation?.();
    setZoomScale((prev) => (prev !== 1 ? 1 : 1.5));
  };

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] isolate flex items-center justify-center select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded memory: ${moment.caption}`}
    >
      {/* ── 1. Full-Bleed Dark Backdrop (Extends beyond edges to prevent any gutter gaps) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed -inset-10 w-[120vw] h-[120vh] bg-[#111620]/95 backdrop-blur-md cursor-pointer"
        onClick={() => {
          playPaperRustle();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* ── 2. Symmetrical Floating Navigation Chevrons ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (hasPrev && onPrev) {
            playPaperRustle();
            onPrev();
          }
        }}
        disabled={!hasPrev}
        className={`fixed left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
          hasPrev
            ? 'bg-white/95 hover:bg-white text-slateAsh shadow-paper-elevated border border-slateAsh/15 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs'
            : 'bg-white/20 text-slateAsh/30 border border-white/10 shadow-none pointer-events-none'
        }`}
        title="Previous memory (Left Arrow)"
        aria-label="Previous memory"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (hasNext && onNext) {
            playPaperRustle();
            onNext();
          }
        }}
        disabled={!hasNext}
        className={`fixed right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
          hasNext
            ? 'bg-white/95 hover:bg-white text-slateAsh shadow-paper-elevated border border-slateAsh/15 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs'
            : 'bg-white/20 text-slateAsh/30 border border-white/10 shadow-none pointer-events-none'
        }`}
        title="Next memory (Right Arrow)"
        aria-label="Next memory"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ── 3. Centered Content Viewport (Zero scrollbar, pure axis alignment) ── */}
      <div
        className="relative z-20 w-full h-full max-h-screen flex flex-col items-center justify-between p-3 sm:p-5 pointer-events-none overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            playPaperRustle();
            onClose();
          }
        }}
      >
        {/* Top Floating Controls Bar */}
        <header className="pointer-events-auto w-full max-w-md sm:max-w-xl mx-auto flex items-center justify-between gap-3 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-paper-elevated border border-slateAsh/15 shrink-0 mt-1">
          {/* Moment Index & Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-skyMist border border-slateAsh/20" />
            <span className="text-xs font-mono font-bold text-slateAsh/80 tracking-wider uppercase">
              Moment {currentIndex + 1} of {totalCount}
            </span>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Zoom Out */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={isFlipped || zoomScale <= 0.75}
              className="p-1.5 rounded-full hover:bg-slateAsh/10 disabled:opacity-30 disabled:pointer-events-none text-slateAsh transition-colors cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Current Zoom Indicator / Reset */}
            <button
              type="button"
              onClick={handleResetZoom}
              disabled={isFlipped}
              className="px-2 py-0.5 rounded-md hover:bg-slateAsh/10 text-xs font-mono font-bold text-slateAsh transition-colors cursor-pointer"
              title="Click to toggle 100% / 150%"
              aria-label="Toggle zoom percentage"
            >
              {Math.round(zoomScale * 100)}%
            </button>

            {/* Zoom In */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={isFlipped || zoomScale >= 2.5}
              className="p-1.5 rounded-full hover:bg-slateAsh/10 disabled:opacity-30 disabled:pointer-events-none text-slateAsh transition-colors cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slateAsh/20 mx-1" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playPaperRustle();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-coralBlush/50 text-slateAsh transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close expanded image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Center Canvas: Exact Horizontal & Vertical Centering */}
        <div
          className="pointer-events-auto my-auto mx-auto flex items-center justify-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              playPaperRustle();
              onClose();
            }
          }}
        >
          {/* 3D Flippable Paper Frame */}
          <div
            className={`relative flex items-center justify-center transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* ── FRONT SIDE: Clean High-Resolution Photo Card (No Tape) ── */}
            <div className="relative inline-flex flex-col items-center bg-white rounded-2xl p-2.5 sm:p-3 pb-3 sm:pb-3.5 backface-hidden shadow-paper-elevated border-2 border-white/90 max-w-[88vw] sm:max-w-xl md:max-w-2xl">
              {/* Photo Frame Viewport */}
              <div
                className="relative rounded-xl overflow-hidden bg-slateAsh/5 flex items-center justify-center cursor-zoom-in"
                onDoubleClick={handleDoubleTap}
              >
                {moment.imageUrl && !imgError ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease-out',
                    }}
                  >
                    <img
                      src={moment.imageUrl}
                      alt={moment.caption}
                      onError={() => setImgError(true)}
                      className="block max-h-[58vh] sm:max-h-[62vh] w-auto max-w-full object-contain rounded-xl select-none"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center min-w-[280px]">
                    <Camera className="w-12 h-12 text-slateAsh/40 mb-2" />
                    <span className="text-base font-bold text-slateAsh font-serifDisplay">
                      {moment.caption}
                    </span>
                    <span className="text-xs text-slateAsh/60 mt-1 font-sans">
                      Memory snapshot preserved in heartfelt words.
                    </span>
                  </div>
                )}
              </div>

              {/* Centered Caption, Date, Location & Flip Button */}
              <div className="w-full pt-2.5 px-2 flex flex-col items-center text-center gap-1 border-t border-slateAsh/10 mt-2">
                <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-slateAsh leading-tight">
                  {moment.caption}
                </h3>
                
                <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slateAsh/65 font-sans">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slateAsh/50" />
                    {moment.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slateAsh/50" />
                    {moment.location}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleFlip}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-buttercup/70 hover:bg-buttercup px-3 py-1 rounded-full border border-buttercup shadow-paper-sm transition-all cursor-pointer hover:scale-105 active:scale-95 ml-1"
                  >
                    <RotateCw className="w-3 h-3 text-slateAsh" />
                    <span>Turn to note</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── BACK SIDE: Authentic Lined-Paper Memory Note ── */}
            <div className="absolute inset-0 w-full h-full bg-[#FFFDF9] lined-paper rounded-2xl p-5 sm:p-7 flex flex-col justify-between rotate-y-180 backface-hidden shadow-paper-elevated border-2 border-slateAsh/15 overflow-hidden">
              {/* Top Stamp / Postmark Header */}
              <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-coralBlush/40 flex items-center justify-center border border-coralBlush/60">
                    <Pin className="w-3.5 h-3.5 text-coralBlush" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slateAsh/60 block leading-tight">
                      Kodak Memory Note
                    </span>
                    <span className="text-xs font-mono font-bold text-slateAsh/80">
                      {moment.date} • {moment.location}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono text-slateAsh/50 uppercase tracking-widest">
                  Original Print
                </span>
              </div>

              {/* Note Body with Doodle */}
              <div
                className="my-auto py-4 px-2 sm:px-4 flex flex-col items-center justify-center text-center cursor-pointer"
                onClick={handleToggleFlip}
                title="Click to flip back to photo"
              >
                <div className="flex justify-center mb-2.5">
                  <IconRenderer name={moment.doodle} className="w-7 h-7 text-slateAsh/70" fallback="sparkles" />
                </div>
                <div className="relative w-full max-w-md mx-auto bg-buttercup/20 border border-dashed border-buttercup/80 rounded-2xl p-4 sm:p-6 shadow-paper-sm">
                  <p className="font-handwriting text-2xl sm:text-3xl text-slateAsh font-medium leading-relaxed">
                    "{moment.backNote}"
                  </p>
                  <span className="font-handwriting text-base sm:text-lg text-slateAsh/70 block mt-2.5 text-right">
                    — {moment.caption}
                  </span>
                </div>
              </div>

              {/* Back Footer */}
              <div className="pt-2.5 border-t border-dashed border-slateAsh/20 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={handleToggleFlip}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-slateAsh bg-skyMist hover:bg-skyMist/80 px-3.5 py-1.5 rounded-full border border-skyMist/90 shadow-paper-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Flip back to photo</span>
                </button>

                <span className="text-xs font-sans text-slateAsh/50">
                  Click anywhere to flip
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Helpful Navigation Bar */}
        <footer className="pointer-events-none w-full max-w-xl text-center py-1 shrink-0 z-20">
          <span className="text-xs font-mono text-white/80 bg-slateAsh/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15 shadow-paper-sm">
            Use ← → arrow keys to browse • Double-click to zoom • Esc to close
          </span>
        </footer>
      </div>
    </div>,
    document.body
  );
}
