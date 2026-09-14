import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Heart, Cake } from 'lucide-react';

export default function AudioWelcomeModal({
  isOpen,
  celebrantName,
  onStartWithMusic,
  onExploreSilently,
}) {
  const modalRef = useRef(null);
  const primaryButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus primary action on mount
    const timer = setTimeout(() => {
      if (primaryButtonRef.current) {
        primaryButtonRef.current.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      // Focus trap within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-dialog-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slateAsh/50 will-change-[opacity]"
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-paper-elevated border-2 border-slateAsh/15 text-center overflow-hidden will-change-transform"
          >
          {/* Decorative Washi Tape */}
          <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-skyMist z-20 rounded-xs -rotate-2 border border-skyMist/80" />

          {/* Birthday Icon badge */}
          <div className="w-16 h-16 rounded-full bg-skyMist border-2 border-skyMist/90 mx-auto flex items-center justify-center shadow-paper-sm mb-4 mt-2">
            <Cake className="w-8 h-8 text-slateAsh" strokeWidth={1.75} />
          </div>

          <h2
            id="welcome-dialog-title"
            className="text-xl sm:text-2xl font-bold text-slateAsh tracking-tight font-sans mb-2"
          >
            Happy Birthday, {celebrantName}!
          </h2>

          <p className="text-sm text-slateAsh/70 leading-relaxed mb-6 font-sans">
            We put together some photos, letters, and background music for your birthday.
          </p>

          <div className="space-y-3">
            <button
              ref={primaryButtonRef}
              onClick={onStartWithMusic}
              className="w-full py-3.5 px-5 rounded-2xl bg-skyMist text-slateAsh font-bold text-sm shadow-paper hover:shadow-paper-hover hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-skyMist/80 group focus:ring-2 focus:ring-skyMist"
            >
              <Music className="w-4 h-4 text-slateAsh group-hover:scale-110 transition-transform" />
              <span>Open with music</span>
            </button>

            <button
              onClick={onExploreSilently}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-slateAsh/70 hover:text-slateAsh hover:bg-cloudWhite transition-colors font-medium focus:ring-2 focus:ring-skyMist"
            >
              Open without music
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-dashed border-slateAsh/15 flex items-center justify-center gap-1 text-xs text-slateAsh/50">
            <Heart className="w-3 h-3 fill-coralBlush text-coralBlush" />
            <span>From your monlings</span>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
}
