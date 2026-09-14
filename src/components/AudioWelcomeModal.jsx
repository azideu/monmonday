import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, Sparkles, Heart } from 'lucide-react';

export default function AudioWelcomeModal({
  isOpen,
  celebrantName,
  onStartWithMusic,
  onExploreSilently,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slateAsh/40 backdrop-blur-md">
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-paper-elevated border-2 border-slateAsh/15 text-center overflow-hidden"
        >
          {/* Decorative Washi Tape */}
          <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-skyMist z-20 rounded-xs -rotate-2 border border-skyMist/80" />

          {/* Birthday Icon badge */}
          <div className="w-16 h-16 rounded-full bg-skyMist border-2 border-skyMist/90 mx-auto flex items-center justify-center text-3xl shadow-paper-sm mb-4 mt-2">
            🎂
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slateAsh tracking-tight font-sans mb-2">
            Happy Birthday, {celebrantName}!
          </h2>

          <p className="text-sm text-slateAsh/70 leading-relaxed mb-6 font-sans">
            We put together some photos, letters, and background music for your birthday.
          </p>

          <div className="space-y-3">
            <button
              onClick={onStartWithMusic}
              className="w-full py-3.5 px-5 rounded-2xl bg-skyMist text-slateAsh font-bold text-sm shadow-paper hover:shadow-paper-hover hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 border-2 border-skyMist/80 group"
            >
              <Music className="w-4 h-4 text-slateAsh group-hover:scale-110 transition-transform" />
              <span>Open with music</span>
            </button>

            <button
              onClick={onExploreSilently}
              className="w-full py-2.5 px-4 rounded-xl text-xs text-slateAsh/70 hover:text-slateAsh hover:bg-cloudWhite transition-colors font-medium"
            >
              Open without music
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-dashed border-slateAsh/15 flex items-center justify-center gap-1 text-[11px] text-slateAsh/50">
            <Heart className="w-3 h-3 fill-coralBlush text-coralBlush" />
            <span>From your friends</span>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
