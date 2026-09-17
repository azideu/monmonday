import React from 'react';
import { Music, Image, Mail, Sparkles, Heart, Waves } from 'lucide-react';

export default function Navbar({
  celebrant,
  isPlaying,
  onToggleMusic,
  activeTrack,
  isFluidEnabled,
  onToggleFluid,
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-2 sm:top-3 z-40 px-2 sm:px-4 max-w-5xl mx-auto w-full mb-3 sm:mb-6 select-none">
      {/* Scrapbook Ribbon Navigation */}
      <nav
        className="relative bg-white/95 backdrop-blur-md border-2 border-skyMist shadow-paper rounded-2xl px-2.5 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between min-h-[48px] sm:min-h-[52px] transition-all"
        style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both' }}
      >
        
        {/* LEFT: Celebrant brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 z-10">
          <div className="w-8 h-8 rounded-full bg-skyMist flex items-center justify-center text-slateAsh shadow-paper-sm border border-skyMist/90 shrink-0">
            <Heart className="w-3.5 h-3.5 fill-coralBlush text-slateAsh" />
          </div>
          <span className="font-bold text-slateAsh text-xs sm:text-sm font-sans flex items-center gap-1.5">
            <span className="truncate max-w-[80px] xs:max-w-none">{celebrant.name}</span>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-skyMist/70 text-slateAsh font-semibold border border-skyMist/80 whitespace-nowrap">
              {celebrant.birthdayDate}
            </span>
          </span>
        </div>

        {/* CENTER: Navigation Tabs (Fluid flex on mobile, centered absolute ribbon on tablet/desktop) */}
        <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center gap-0.5 sm:gap-1 text-xs font-semibold text-slateAsh pointer-events-auto z-10">
          <button
            onClick={() => scrollToSection('photos-section')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg hover:bg-skyMist/60 active:bg-skyMist/80 transition-colors flex items-center justify-center gap-1 min-h-[44px] min-w-[40px] sm:min-w-0 cursor-pointer"
            aria-label="Scroll to photos"
          >
            <Image className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slateAsh/80" />
            <span className="hidden sm:inline">Photos</span>
          </button>

          <button
            onClick={() => scrollToSection('letters-section')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg hover:bg-skyMist/60 active:bg-skyMist/80 transition-colors flex items-center justify-center gap-1 min-h-[44px] min-w-[40px] sm:min-w-0 cursor-pointer"
            aria-label="Scroll to letters"
          >
            <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slateAsh/80" />
            <span className="hidden sm:inline">Letters</span>
          </button>

          <button
            onClick={() => scrollToSection('mixtape-section')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg hover:bg-skyMist/60 active:bg-skyMist/80 transition-colors flex items-center justify-center gap-1 min-h-[44px] min-w-[40px] sm:min-w-0 cursor-pointer"
            aria-label="Scroll to music"
          >
            <Music className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slateAsh/80" />
            <span className="hidden sm:inline">Music</span>
          </button>

          <button
            onClick={() => scrollToSection('cake-section')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg hover:bg-skyMist/60 active:bg-skyMist/80 transition-colors flex items-center justify-center gap-1 min-h-[44px] min-w-[40px] sm:min-w-0 cursor-pointer"
            aria-label="Scroll to birthday cake and wish"
          >
            <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slateAsh/80" />
            <span className="hidden md:inline">Wish</span>
          </button>
        </div>

        {/* RIGHT: Controls (Fluid cursor & Music playback) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 z-10">
          {/* Magic Stardust Cursor Effect Toggle */}
          <button
            onClick={onToggleFluid}
            title={isFluidEnabled ? "Disable magic stardust trail" : "Enable magic stardust trail"}
            aria-label="Toggle magic stardust cursor effect"
            className={`flex items-center justify-center gap-1.5 text-xs font-semibold p-2 sm:px-3 sm:py-1.5 min-h-[44px] min-w-[40px] sm:min-w-0 rounded-xl transition-all shadow-paper-sm cursor-pointer ${
              isFluidEnabled
                ? 'bg-skyMist text-slateAsh ring-1 ring-skyMist/80 border border-skyMist/90'
                : 'bg-cloudWhite border border-slateAsh/15 text-slateAsh/60 hover:bg-skyMist/30'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isFluidEnabled ? 'text-slateAsh' : 'text-slateAsh/60'}`} />
            <span className="hidden md:inline">Magic Dust</span>
          </button>

          {/* Music Quick Control */}
          <button
            onClick={onToggleMusic}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className={`flex items-center justify-center gap-2 text-xs font-semibold px-2.5 sm:px-3 py-2 sm:py-1.5 min-h-[44px] rounded-xl transition-all shadow-paper-sm cursor-pointer ${
              isPlaying 
                ? 'bg-skyMist text-slateAsh ring-2 ring-skyMist/80 border border-skyMist/90' 
                : 'bg-cloudWhite border border-skyMist text-slateAsh hover:bg-skyMist/40'
            }`}
          >
            {/* Smooth rhythmic equalizer bars */}
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 shrink-0">
              <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-1' : 'h-1.5'}`} />
              <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-2' : 'h-2.5'}`} />
              <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-3' : 'h-1'}`} />
            </div>
            <span className="hidden sm:inline font-sans">Music</span>
          </button>
        </div>

      </nav>
    </header>

  );
}
