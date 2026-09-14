import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function BirthdayCake({ celebration, celebrantName = "Monmonkyu" }) {
  const [isBlown, setIsBlown] = useState(false);
  const [wishCount, setWishCount] = useState(0);

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
  };

  return (
    <div id="cake-section" className="relative w-full max-w-md mx-auto my-12 text-center select-none">

      {/* Decorative Washi Tape */}
      <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-paleLilac/80 z-20 rounded-xs rotate-1" />

      {/* Card container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-paper border-2 border-slateAsh/15 relative overflow-hidden">

        {/* Subtitle / Header */}
        <h3 className="font-bold text-slateAsh text-lg sm:text-xl font-sans mb-1">
          Make a wish
        </h3>
        <p className="text-xs text-slateAsh/70 font-sans max-w-xs mx-auto mb-6">
          {!isBlown 
            ? "Think of a wish and click the candle to blow it out." 
            : "Candle blown!"}
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
          className={`relative w-48 h-44 mx-auto flex flex-col items-center justify-end group transition-transform ${!isBlown ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
            }`}
        >
          {/* Flame & Wick */}
          <div className="relative flex flex-col items-center -mb-1 z-20">
            {/* Candle Flame */}
            {!isBlown ? (
              <div className="relative">
                {/* Outer flame glow */}
                <div className="w-5 h-8 bg-buttercup rounded-full filter blur-[1px] animate-pulse" />
                {/* Core flame */}
                <div
                  className="absolute inset-0 m-auto w-3 h-6 bg-orange-400 rounded-full"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 70%, 50% 100%, 0% 70%)',
                    animation: 'flicker 1.5s infinite alternate ease-in-out'
                  }}
                />
                {/* Inner white hot spot */}
                <div className="absolute inset-0 m-auto w-1.5 h-3 bg-white rounded-full top-2" />
              </div>
            ) : (
              /* Smoke Puff when blown */
              <div className="h-8 flex items-center justify-center">
                <span className="text-sm animate-bounce text-slateAsh/40">☁️</span>
              </div>
            )}

            {/* Candle Wick */}
            <div className="w-0.5 h-2.5 bg-slateAsh" />
          </div>

          {/* Candle Cylinder */}
          <div className="w-4 h-12 bg-skyMist rounded-t-sm border border-slateAsh/20 flex flex-col justify-between py-1 shadow-sm z-10">
            {/* Candle stripes */}
            <div className="w-full h-1 bg-coralBlush/70 -rotate-12" />
            <div className="w-full h-1 bg-pastelMint/70 -rotate-12" />
            <div className="w-full h-1 bg-buttercup/70 -rotate-12" />
          </div>

          {/* Cake Top Layer (Icing) */}
          <div className="relative w-32 h-10 bg-coralBlush rounded-t-2xl border-2 border-b-0 border-slateAsh/20 flex items-center justify-center shadow-inner">
            {/* Icing Drips */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-around">
              <div className="w-3 h-3.5 bg-coralBlush rounded-full" />
              <div className="w-4 h-4 bg-coralBlush rounded-full" />
              <div className="w-3.5 h-3.5 bg-coralBlush rounded-full" />
              <div className="w-3 h-4 bg-coralBlush rounded-full" />
              <div className="w-4 h-3 bg-coralBlush rounded-full" />
            </div>
          </div>

          {/* Cake Base Layer */}
          <div className="w-44 h-14 bg-white rounded-b-2xl border-2 border-slateAsh/20 flex items-center justify-center relative overflow-hidden shadow-paper-sm">
            {/* Decorative pastel sprinkle dots */}
            <div className="absolute inset-0 flex flex-wrap gap-3 p-2 opacity-80 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-buttercup" />
              <div className="w-1.5 h-1.5 rounded-full bg-pastelMint" />
              <div className="w-1.5 h-1.5 rounded-full bg-paleLilac" />
              <div className="w-1.5 h-1.5 rounded-full bg-skyMist" />
              <div className="w-1.5 h-1.5 rounded-full bg-coralBlush" />
            </div>
            <span className="font-handwriting text-slateAsh text-lg font-bold z-10">
              Happy Bday {celebrantName}!
            </span>
          </div>

          {/* Cake Plate */}
          <div className="w-52 h-3 bg-slateAsh/10 rounded-full mt-0.5 border-t border-slateAsh/15" />
        </div>

        {/* Status Prompt / Blow Action feedback */}
        <div className="mt-5 min-h-[50px] flex flex-col items-center justify-center">
          {!isBlown ? (
            <button
              onClick={blowCandle}
              className="px-5 py-2.5 rounded-full bg-skyMist text-slateAsh font-bold text-xs shadow-paper-sm hover:shadow-paper hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-skyMist/80"
            >
              <Sparkles className="w-4 h-4 text-slateAsh" />
              Blow out the candle
            </button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-skyMist/60 rounded-xl border-2 border-skyMist/80 text-slateAsh">
                <p className="font-handwriting text-xl font-bold">
                  {celebration?.blownMessage || "Candle blown!"}
                </p>
              </div>
              <button
                onClick={relightCandle}
                className="inline-flex items-center gap-1.5 text-xs text-slateAsh/70 hover:text-slateAsh font-medium transition-colors"
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
