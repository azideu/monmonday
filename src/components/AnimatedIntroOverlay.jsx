import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Music, Cake, Sparkles, Heart, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * AnimatedIntroOverlay
 * A tactile scrapbook keepsake intro that conceals asset loading (photos, fonts, audio)
 * behind a cozy stationery gift parcel. Once loaded, it seamlessly prompts the user to
 * "Unwrap with Music" or "Open Silently", satisfying browser audio autoplay consent.
 */
export default function AnimatedIntroOverlay({
  celebrantName = "Monmonkyu",
  progress = 0,
  isReady = false,
  statusText = "Gathering cherished memories...",
  onUnwrap, // (withMusic: boolean) => void
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const unwrapButtonRef = useRef(null);

  // Focus the primary action once ready
  useEffect(() => {
    if (isReady && unwrapButtonRef.current) {
      const timer = setTimeout(() => {
        unwrapButtonRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // Handle unwrap action with pastel celebratory confetti
  const handleTriggerUnwrap = (withMusic) => {
    if (isUnwrapping) return;
    setIsUnwrapping(true);

    // Fire cozy pastel confetti burst matching the scrapbook palette
    if (!shouldReduceMotion) {
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4F1FF', '#FFEE8C', '#FFAAA6', '#E8E0F0', '#B5EAD7'],
          disableForReducedMotion: true,
          scalar: 0.9,
          ticks: 120,
        });
      } catch (e) {
        // Confetti fallback if canvas is not initialized
      }
    }

    // Allow the unwrap paper fold & wax seal animation to complete before unmounting
    const exitDuration = shouldReduceMotion ? 250 : 650;
    setTimeout(() => {
      onUnwrap(withMusic);
    }, exitDuration);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="scrapbook-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isUnwrapping ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.25 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#EBF7FD] bg-scrapbook-pattern overflow-hidden select-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Welcome to ${celebrantName}'s Birthday Scrapbook`}
      >
        {/* Soft Ambient Scrapbook Grain & Vignette */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        {/* Floating Gentle Ephemera Stamps in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-8 hidden sm:block p-2 rounded-xl bg-white/60 border border-slateAsh/10 shadow-paper-sm -rotate-3"
          >
            <Sparkles className="w-5 h-5 text-buttercup" />
          </motion.div>

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-10 hidden sm:block p-2 rounded-xl bg-white/60 border border-slateAsh/10 shadow-paper-sm rotate-6"
          >
            <Heart className="w-5 h-5 text-coralBlush fill-coralBlush/40" />
          </motion.div>
        </div>

        {/* Central Keepsake Parcel Card */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={
            isUnwrapping
              ? { scale: 1.05, opacity: 0, y: -20 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{
            duration: isUnwrapping ? 0.55 : 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-paper-elevated border-2 border-slateAsh/15 text-center overflow-hidden will-change-transform z-10"
        >
          {/* Top Decorative Washi Tape */}
          <div
            className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-skyMist z-20 rounded-xs -rotate-1 border border-skyMist/80"
            aria-hidden="true"
          />

          {/* Postal / Keepsake Header Stamp */}
          <div className="flex items-center justify-between text-xs font-bold text-slateAsh/50 uppercase tracking-wider mb-4 border-b border-dashed border-slateAsh/15 pb-2 px-1">
            <span className="flex items-center gap-1 font-sans">
              <Gift className="w-3.5 h-3.5 text-coralBlush" />
              Special Delivery
            </span>
            <span className="font-handwriting text-sm text-slateAsh/70">Sep 18</span>
          </div>

          {/* Wax Seal Medallion */}
          <div className="relative mx-auto my-3 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <motion.div
              animate={
                isReady
                  ? { scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }
                  : { rotate: [0, 5, -5, 0] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-full bg-buttercup border-4 border-buttercup/90 shadow-paper flex items-center justify-center relative"
            >
              {/* Inner ring for embossed wax feel */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-slateAsh/20 flex items-center justify-center bg-[#FFE566]">
                <Cake className="w-6 h-6 sm:w-7 sm:h-7 text-slateAsh" strokeWidth={1.8} />
              </div>
            </motion.div>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-sans mt-2 mb-1">
            {isReady ? `Happy Birthday, ${celebrantName}!` : `For ${celebrantName}`}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-xs sm:text-sm text-slateAsh/70 leading-relaxed max-w-xs mx-auto mb-5 font-sans min-h-[40px] flex items-center justify-center">
            {isReady
              ? "Your monlings gathered photos, heartfelt letters, and music for your special day."
              : "Preparing your personalized scrapbook album..."}
          </p>

          {/* Dynamic Content: Progress Track (Loading) OR Action Buttons (Ready) */}
          <div className="min-h-[90px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isReady ? (
                /* ── PHASE 1: Loading Progress ────────────────────────────── */
                <motion.div
                  key="loading-state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                  aria-live="polite"
                >
                  {/* Washi-tape Styled Progress Bar */}
                  <div className="relative w-full h-3.5 bg-slateAsh/10 rounded-full overflow-hidden p-0.5 border border-slateAsh/15">
                    <motion.div
                      className="h-full bg-skyMist rounded-full border border-skyMist/90 relative"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.2 }}
                    >
                      {/* Subtle diagonal pinstripe paper effect */}
                      <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(62,74,91,0.2)_6px,rgba(62,74,91,0.2)_12px)]" />
                    </motion.div>
                  </div>

                  {/* Status Narrative & Percentage */}
                  <div className="flex items-center justify-between text-xs text-slateAsh/60 font-sans px-1">
                    <span className="truncate pr-2 font-medium italic">
                      {statusText}
                    </span>
                    <span className="font-bold tabular-nums text-slateAsh/80 shrink-0">
                      {progress}%
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* ── PHASE 2: Ready to Unwrap Actions ─────────────────────── */
                <motion.div
                  key="ready-state"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2.5"
                >
                  {/* Primary: Unwrap with Music */}
                  <button
                    ref={unwrapButtonRef}
                    onClick={() => handleTriggerUnwrap(true)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-skyMist text-slateAsh font-bold text-sm shadow-paper hover:shadow-paper-hover hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-skyMist/90 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-skyMist focus:ring-offset-2"
                  >
                    <Music className="w-4 h-4 text-slateAsh group-hover:scale-110 transition-transform" />
                    <span>Unwrap with Music</span>
                  </button>

                  {/* Secondary: Open Silently */}
                  <button
                    onClick={() => handleTriggerUnwrap(false)}
                    className="w-full py-2 px-4 rounded-xl text-xs text-slateAsh/70 hover:text-slateAsh hover:bg-cloudWhite transition-colors font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-skyMist"
                  >
                    Open without music
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Footer Stamp */}
          <div className="mt-5 pt-3.5 border-t border-dashed border-slateAsh/15 flex items-center justify-center gap-1.5 text-xs text-slateAsh/50">
            <Heart className="w-3 h-3 fill-coralBlush text-coralBlush" />
            <span className="font-handwriting text-sm text-slateAsh/70">From your monlings</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
