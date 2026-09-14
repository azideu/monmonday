import React from 'react';
import { Music, Image, Mail, Sparkles, Heart } from 'lucide-react';

export default function Navbar({ celebrant, isPlaying, onToggleMusic, activeTrack }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-4 max-w-5xl mx-auto w-full mb-4 sm:mb-6 select-none">
      {/* Scrapbook Ribbon Navigation */}
      <nav className="relative bg-white/95 backdrop-blur-md border-2 border-skyMist shadow-paper rounded-2xl px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all">
        
        {/* Subtle washi tape pin accent */}
        <div className="washi-tape absolute -top-2 left-6 w-16 h-4 bg-skyMist/90 rounded-xs -rotate-2 hidden sm:block border border-skyMist/70" />

        {/* Celebrant brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-skyMist flex items-center justify-center text-slateAsh shadow-paper-sm border border-skyMist/90">
            <Heart className="w-3.5 h-3.5 fill-coralBlush text-slateAsh" />
          </div>
          <span className="font-bold text-slateAsh text-xs sm:text-sm font-sans flex items-center gap-1.5">
            {celebrant.name}
            <span className="text-xs px-2 py-0.5 rounded-full bg-skyMist/70 text-slateAsh font-semibold border border-skyMist/80">
              {celebrant.birthdayDate}
            </span>
          </span>
        </div>

        {/* Scrapbook Bookmark Navigation Tabs */}
        <div className="flex items-center gap-1 text-xs font-semibold text-slateAsh">
          <button
            onClick={() => scrollToSection('photos-section')}
            className="px-2.5 py-1 rounded-lg hover:bg-skyMist/60 transition-colors flex items-center gap-1"
          >
            <Image className="w-3 h-3 text-slateAsh/80" />
            <span className="hidden xs:inline sm:inline">Photos</span>
          </button>

          <button
            onClick={() => scrollToSection('letters-section')}
            className="px-2.5 py-1 rounded-lg hover:bg-skyMist/60 transition-colors flex items-center gap-1"
          >
            <Mail className="w-3 h-3 text-slateAsh/80" />
            <span className="hidden xs:inline sm:inline">Letters</span>
          </button>

          <button
            onClick={() => scrollToSection('mixtape-section')}
            className="px-2.5 py-1 rounded-lg hover:bg-skyMist/60 transition-colors flex items-center gap-1"
          >
            <Music className="w-3 h-3 text-slateAsh/80" />
            <span className="hidden sm:inline">Music</span>
          </button>

          <button
            onClick={() => scrollToSection('cake-section')}
            className="px-2.5 py-1 rounded-lg hover:bg-skyMist/60 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-slateAsh/80" />
            <span className="hidden md:inline">Wish</span>
          </button>
        </div>

        {/* Music Quick Control with Organic Equalizer */}
        <button
          onClick={onToggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-paper-sm ${
            isPlaying 
              ? 'bg-skyMist text-slateAsh ring-2 ring-skyMist/80 border border-skyMist/90' 
              : 'bg-cloudWhite border border-skyMist text-slateAsh hover:bg-skyMist/40'
          }`}
        >
          {/* Smooth rhythmic equalizer bars (no bounce-easing) */}
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-1' : 'h-1.5'}`} />
            <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-2' : 'h-2.5'}`} />
            <span className={`w-1 bg-slateAsh rounded-full ${isPlaying ? 'animate-eq-3' : 'h-1'}`} />
          </div>
          <span className="hidden md:inline truncate max-w-[100px]">
            {isPlaying ? (activeTrack?.title || 'Playing') : 'Music'}
          </span>
        </button>

      </nav>
    </header>
  );
}
