import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Cloud } from 'lucide-react';

export default function BirthdayCake({ celebration, celebrantName = "Monmonkyu" }) {
  const [isBlown, setIsBlown] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [relightCount, setRelightCount] = useState(0);

  const blowCandle = () => {
    if (isBlown) return;

    setIsBlown(true);
    setWishCount((prev) => prev + 1);

    // Multi-stage pastel confetti burst
    const colors = celebration?.confettiColors || [
      '#D4F1FF',
      '#FFEE8C',
      '#C8F7DC',
      '#FFD6D6',
      '#E5DBFF',
    ];

    // Center burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: colors,
      disableForReducedMotion: true,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: colors,
      });
    }, 250);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: colors,
      });
    }, 450);
  };

  const relightCandle = () => {
    setIsBlown(false);
    setRelightCount((prev) => prev + 1);
  };

  return (
    <div id="cake-section" className="relative w-full max-w-lg mx-auto my-6 text-center select-none">

      {/* Decorative Washi Tape */}
      <div className="washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 bg-paleLilac/90 z-20 rounded-xs rotate-1 border border-slateAsh/15" />

      {/* Card container */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-paper-elevated border-2 border-slateAsh/20 relative overflow-hidden">

        {/* Subtitle / Header */}
        <h3 className="font-extrabold text-slateAsh text-3xl sm:text-4xl font-serifDisplay tracking-tight mb-1.5">
          Make a wish
        </h3>
        <p className="text-xs sm:text-sm text-slateAsh/70 font-sans max-w-sm mx-auto mb-8 leading-relaxed">
          {relightCount >= 3
            ? "okay maybe that's a bit too much."
            : !isBlown 
              ? "Think of your biggest wish for the year ahead and blow out the candle." 
              : "Candle blown! May every bit of your wish come true."}
        </p>

        {/* Interactive Cake Illustration */}
        <div
          onClick={blowCandle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              blowCandle();
            }
          }}
          tabIndex={!isBlown ? 0 : -1}
          role="button"
          aria-label={!isBlown ? "Click to blow out the birthday candle" : "Birthday candle is blown"}
          className={`relative w-64 h-52 mx-auto flex flex-col items-center justify-end group transition-transform ${!isBlown ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
            }`}
        >
          {/* Candles forming '22' */}
          <div className="relative flex items-end justify-center gap-5 -mb-1 z-20">
            {/* First '2' Candle */}
            <div className="flex flex-col items-center">
              {/* Flame & Wick */}
              <div className="relative flex flex-col items-center -mb-1">
                {!isBlown ? (
                  <div className="relative">
                    {/* Outer flame glow — warm amber bloom, breathes at ~2s */}
                    <div
                      className="w-6 h-9 bg-buttercup rounded-full filter blur-[3px]"
                      style={{ animation: 'flicker 2.1s infinite alternate ease-in-out' }}
                    />
                    {/* Core flame — teardrop, flickers at 1.4s for organic feel */}
                    <div
                      className="absolute inset-0 m-auto w-3.5 h-7 bg-orange-400 rounded-full"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 70%, 50% 100%, 0% 70%)',
                        animation: 'flicker 1.4s infinite alternate ease-in-out'
                      }}
                    />
                    {/* Inner white hot spot — stationary, just blinks gently */}
                    <div className="absolute inset-0 m-auto w-1.5 h-3.5 bg-white rounded-full top-1.5" />
                  </div>
                ) : (
                  /* Smoke Puff when blown */
                  <div className="h-9 flex items-center justify-center">
                    <Cloud className="w-5 h-5 animate-smoke-rise text-slateAsh/50 select-none fill-slateAsh/10" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                )}
                {/* Candle Wick */}
                <div className="w-0.5 h-2.5 bg-slateAsh" />
              </div>

              {/* Number 2 Candle Body */}
              <div className="w-11 h-14 bg-white/95 rounded-xl border-2 border-slateAsh/30 shadow-paper-sm flex items-center justify-center relative overflow-hidden bg-[radial-gradient(#D4F1FF_1.5px,transparent_1.5px)] [background-size:6px_6px]">
                {/* Top/bottom edge trims */}
                <div className="absolute top-0 inset-x-0 h-1 bg-buttercup" />
                <span className="font-serifDisplay text-3xl font-extrabold text-slateAsh tracking-tighter select-none">
                  2
                </span>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-skyMist" />
              </div>
            </div>

            {/* Second '2' Candle */}
            <div className="flex flex-col items-center">
              {/* Flame & Wick */}
              <div className="relative flex flex-col items-center -mb-1">
                {!isBlown ? (
                  <div className="relative">
                    {/* Outer flame glow — offset timing for natural twin-candle feel */}
                    <div
                      className="w-6 h-9 bg-buttercup rounded-full filter blur-[3px]"
                      style={{ animation: 'flicker 2.4s 0.3s infinite alternate-reverse ease-in-out' }}
                    />
                    {/* Core flame */}
                    <div
                      className="absolute inset-0 m-auto w-3.5 h-7 bg-orange-400 rounded-full"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 70%, 50% 100%, 0% 70%)',
                        animation: 'flicker 1.6s infinite alternate-reverse ease-in-out'
                      }}
                    />
                    {/* Inner white hot spot */}
                    <div className="absolute inset-0 m-auto w-1.5 h-3.5 bg-white rounded-full top-1.5" />
                  </div>
                ) : (
                  /* Smoke Puff when blown */
                  <div className="h-9 flex items-center justify-center">
                    <Cloud className="w-5 h-5 animate-smoke-rise text-slateAsh/50 select-none fill-slateAsh/10" style={{ animationDelay: '0.15s' }} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                )}
                {/* Candle Wick */}
                <div className="w-0.5 h-2.5 bg-slateAsh" />
              </div>

              {/* Number 2 Candle Body */}
              <div className="w-11 h-14 bg-white/95 rounded-xl border-2 border-slateAsh/30 shadow-paper-sm flex items-center justify-center relative overflow-hidden bg-[radial-gradient(#D4F1FF_1.5px,transparent_1.5px)] [background-size:6px_6px]">
                {/* Top/bottom edge trims */}
                <div className="absolute top-0 inset-x-0 h-1 bg-buttercup" />
                <span className="font-serifDisplay text-3xl font-extrabold text-slateAsh tracking-tighter select-none">
                  2
                </span>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-skyMist" />
              </div>
            </div>
          </div>

          {/* Cake Top Layer (Blue Sky Mist Icing) */}
          <div className="relative w-44 h-12 bg-[#BEE7FD] rounded-t-3xl border-2 border-b-0 border-slateAsh/25 flex items-center justify-center shadow-inner">
            {/* Scalloped blue icing drips */}
            <div className="absolute -bottom-2.5 inset-x-0 flex justify-around">
              <div className="w-4 h-4 bg-[#BEE7FD] rounded-full" />
              <div className="w-5 h-5 bg-[#BEE7FD] rounded-full" />
              <div className="w-4.5 h-4.5 bg-[#BEE7FD] rounded-full" />
              <div className="w-5 h-5 bg-[#BEE7FD] rounded-full" />
              <div className="w-5 h-4 bg-[#BEE7FD] rounded-full" />
            </div>
          </div>

          {/* Cake Base Layer (Deep Sky Mist Blue with celebratory sprinkles) */}
          <div className="w-56 h-16 bg-[#D4F1FF] rounded-b-3xl border-2 border-slateAsh/25 flex items-center justify-center relative overflow-hidden shadow-paper-sm">
            {/* Pastel sprinkle dots */}
            <div className="absolute inset-0 flex flex-wrap gap-4 p-2.5 opacity-80 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
              <div className="w-2 h-2 rounded-full bg-buttercup" />
              <div className="w-2 h-2 rounded-full bg-pastelMint" />
              <div className="w-2 h-2 rounded-full bg-paleLilac" />
              <div className="w-2 h-2 rounded-full bg-coralBlush" />
            </div>
            <span className="font-handwriting text-slateAsh text-2xl font-bold z-10 drop-shadow-xs">
              Happy 22nd {celebrantName}!
            </span>
          </div>

          {/* Cake Plate */}
          <div className="w-64 h-3.5 bg-slateAsh/15 rounded-full mt-1 border-t border-slateAsh/20 shadow-xs" />
        </div>

        {/* Status Prompt / Blow Action feedback */}
        <div className="mt-8 min-h-[56px] flex flex-col items-center justify-center">
          {!isBlown ? (
            <button
              onClick={blowCandle}
              className="px-7 py-3 rounded-full bg-skyMist text-slateAsh font-bold text-sm shadow-paper hover:shadow-paper-elevated hover:bg-skyMist/90 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-slateAsh/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slateAsh fill-buttercup" />
              Blow out the candle
            </button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-skyMist/60 rounded-xl border-2 border-skyMist/80 text-slateAsh">
                <p className="font-handwriting text-xl font-bold">
                  {relightCount >= 3 
                    ? "okay maybe that's a bit too much." 
                    : (celebration?.blownMessage || "Candle blown!")}
                </p>
              </div>
              <button
                onClick={relightCandle}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 text-xs text-slateAsh/70 hover:text-slateAsh hover:bg-skyMist/30 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Relight candle ({wishCount})
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
