import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Heart, Sparkles } from 'lucide-react';

export default function LetterModal({ letter, isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !letter) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Soft backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slateAsh/40 backdrop-blur-sm transition-opacity"
        />

        {/* Letter Container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-paper-elevated border-2 border-slateAsh/15 overflow-hidden my-8"
        >
          {/* Decorative Washi Tape on top */}
          <div className="washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-6 bg-skyMist z-20 rounded-xs -rotate-1 border border-skyMist/80" />

          {/* Header Bar */}
          <div className="bg-skyMist/75 border-b-2 border-skyMist/90 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-paper-sm border border-slateAsh/10">
                {letter.sealIcon || '💌'}
              </div>
              <div>
                <h3 className="font-bold text-slateAsh text-base sm:text-lg flex items-center gap-2">
                  {letter.author}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 border border-slateAsh/15 text-slateAsh/80 font-normal">
                    {letter.relationship}
                  </span>
                </h3>
                <p className="text-xs text-slateAsh/60 flex items-center gap-1 font-sans">
                  <Calendar className="w-3 h-3" /> {letter.date}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-slateAsh/70 hover:text-slateAsh transition-colors border border-transparent hover:border-slateAsh/15"
              aria-label="Close letter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Letter Content Body */}
          <div className="p-6 sm:p-10 lined-paper min-h-[350px]">
            {letter.type === 'handwritten' && letter.scanUrl ? (
              <div className="space-y-4">
                <img
                  src={letter.scanUrl}
                  alt={`Handwritten letter from ${letter.author}`}
                  className="w-full rounded-lg shadow-paper border border-slateAsh/15"
                />
                {letter.content && (
                  <div className="mt-6 pt-6 border-t border-dashed border-slateAsh/20">
                    <span className="text-xs font-mono uppercase text-slateAsh/50 tracking-wider">
                      Transcript:
                    </span>
                    <p className="font-sans text-slateAsh text-sm mt-2 whitespace-pre-line leading-relaxed">
                      {letter.content}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-handwriting text-2xl sm:text-3xl text-slateAsh leading-relaxed whitespace-pre-line">
                  {letter.content}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="bg-[#FAF7F2] border-t border-slateAsh/10 px-6 py-3 flex items-center justify-between text-xs text-slateAsh/60">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-buttercup" />
              Written with love for Monmonkyu's Birthday
            </span>
            <button
              onClick={onClose}
              className="font-medium text-slateAsh hover:underline"
            >
              Fold Letter
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
