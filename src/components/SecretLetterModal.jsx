import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Key, X, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPaperRustle } from '../utils/soundEffects.js';

export default function SecretLetterModal({ letter, isOpen, onClose, onUnlock }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMsg('');
      setIsShaking(false);
      setIsUnlocked(false);
      playPaperRustle();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, letter]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!letter || !letter.password) return;

    const entered = passwordInput.trim().toLowerCase();
    const expected = Array.isArray(letter.password)
      ? letter.password.map((p) => String(p).trim().toLowerCase())
      : [String(letter.password).trim().toLowerCase()];

    if (expected.includes(entered)) {
      setIsUnlocked(true);
      setErrorMsg('');

      // Confetti celebration burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4F1FF', '#FFEE8C', '#C8F7DC', '#FFD6D6', '#E5DBFF'],
          disableForReducedMotion: true,
        });
      } catch {}

      // Short delay so user sees the unlock flourish before transitioning to the reader
      setTimeout(() => {
        onUnlock(letter);
      }, 400);
    } else {
      setIsShaking(true);
      setErrorMsg("Hmm, that's not it! Check the clue or ask them ✨");
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.select();
    }
  };

  if (!isOpen || !letter) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="secret-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slateAsh/60 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Secret Wax Seal Unsealing Station Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            x: isShaking ? [-8, 8, -6, 6, -3, 3, 0] : 0,
          }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#FFFDF9] rounded-2xl shadow-paper-elevated border-2 border-slateAsh/15 p-6 sm:p-8 overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Washi Tape Pin */}
          <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-buttercup/90 z-20 -rotate-1 rounded-xs border border-slateAsh/10 shadow-xs" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-slateAsh/60 hover:text-slateAsh hover:bg-slateAsh/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Wax Seal Padlock Medallion */}
          <div className="flex justify-center mb-4 mt-2">
            <motion.div
              animate={{ 
                scale: isUnlocked ? [1, 1.15, 1] : 1,
                rotate: isUnlocked ? [0, -10, 10, 0] : 0
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-paper border-2 border-white/80 relative"
              style={{ backgroundColor: letter.sealColor || '#FFD6D6' }}
            >
              {isUnlocked ? (
                <motion.div
                  initial={{ scale: 0.75, rotate: -12 }}
                  animate={{ scale: [0.75, 1.15, 1], rotate: [-12, 4, 0] }}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
                >
                  <Unlock className="w-8 h-8 text-slateAsh" strokeWidth={2.2} />
                </motion.div>
              ) : (
                <Lock className="w-7 h-7 text-slateAsh" strokeWidth={2.2} />
              )}
              <div className="absolute inset-1 rounded-full border border-slateAsh/15 pointer-events-none" />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1 mb-5">
            <h3 id="secret-modal-title" className="text-xl font-bold text-slateAsh font-serifDisplay tracking-tight">
              Secret Letter
            </h3>
            <p className="text-xs text-slateAsh/70 font-sans flex items-center justify-center gap-1.5">
              <span>From <strong className="font-bold text-slateAsh">{letter.author}</strong></span>
              {letter.relationship && (
                <span className="px-2 py-0.2 rounded-full bg-white border border-slateAsh/15 text-[10px] font-mono">
                  {letter.relationship}
                </span>
              )}
            </p>
          </div>

          {/* Riddle / Clue Sticky Note */}
          <div className="relative bg-[#FFF9E6] border border-[#ECD9A0] rounded-xl p-3.5 mb-5 shadow-paper-sm rotate-[-0.5deg]">
            <div className="washi-tape absolute -top-2 left-6 w-14 h-4 bg-pastelMint/80 z-10 rotate-2 rounded-xs border border-slateAsh/10" />
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-slateAsh/60 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-slateAsh/60 tracking-wider block font-bold">
                  Clue from {letter.author}:
                </span>
                <p className="font-handwriting text-lg text-slateAsh leading-snug mt-0.5">
                  "{letter.passwordHint || "Answer the secret question to break the seal!"}"
                </p>
              </div>
            </div>
          </div>

          {/* Password Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="secret-password-input" className="sr-only">
                Secret password or answer
              </label>
              <div className="relative">
                <input
                  id="secret-password-input"
                  ref={inputRef}
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Type secret word..."
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-white border-2 border-slateAsh/20 focus:border-skyMist focus:ring-2 focus:ring-skyMist/50 rounded-xl px-4 py-2.5 text-center font-mono text-base font-semibold text-slateAsh tracking-wider outline-none transition-all shadow-inner-paper placeholder:text-slateAsh/35 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
                />
              </div>

              {errorMsg && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans text-[#E56B6F] font-semibold text-center mt-2"
                >
                  {errorMsg}
                </motion.p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slateAsh/20 text-xs font-sans font-semibold text-slateAsh/70 hover:bg-slateAsh/5 active:scale-98 transition-all cursor-pointer"
              >
                Never mind
              </button>

              <button
                type="submit"
                disabled={!passwordInput.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-skyMist hover:bg-skyMist/80 border border-slateAsh/20 text-xs font-sans font-bold text-slateAsh shadow-paper-sm hover:shadow-paper transition-all flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-slateAsh" />
                <span>Break Seal</span>
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-dashed border-slateAsh/15 text-center">
            <span className="text-[10px] font-sans text-slateAsh/50 flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-coralBlush" />
              <span>Once unlocked, this letter stays open on this device</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
