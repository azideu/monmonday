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
    <header className="sticky top-4 z-40 px-4 max-w-5xl mx-auto w-full mb-6">
      <nav className="bg-white/90 backdrop-blur-md border-2 border-skyMist shadow-paper rounded-full px-5 py-2.5 flex items-center justify-between gap-3 transition-all duration-300">
        
        {/* Celebrant brand / title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-skyMist flex items-center justify-center text-slateAsh shadow-paper-sm border border-skyMist/80">
            <Heart className="w-4 h-4 fill-coralBlush text-slateAsh" />
          </div>
          <div>
            <span className="font-bold text-slateAsh tracking-tight text-sm md:text-base font-sans flex items-center gap-1.5">
              {celebrant.name}'s Scrapbook
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-skyMist text-slateAsh font-semibold border border-skyMist/70">
                {celebrant.birthdayDate}
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slateAsh">
          <button
            onClick={() => scrollToSection('mixtape-section')}
            className="px-3 py-1.5 rounded-full hover:bg-skyMist/70 transition-colors flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Mixtape</span>
          </button>
          <button
            onClick={() => scrollToSection('photos-section')}
            className="px-3 py-1.5 rounded-full hover:bg-skyMist/70 transition-colors flex items-center gap-1.5"
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photos</span>
          </button>
          <button
            onClick={() => scrollToSection('letters-section')}
            className="px-3 py-1.5 rounded-full hover:bg-skyMist/70 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Letters</span>
          </button>
          <button
            onClick={() => scrollToSection('cake-section')}
            className="px-3 py-1.5 rounded-full hover:bg-skyMist/70 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Make a Wish</span>
          </button>
        </div>

        {/* Music Quick Control */}
        <button
          onClick={onToggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className={`flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all shadow-paper-sm ${
            isPlaying 
              ? 'bg-skyMist text-slateAsh font-bold ring-2 ring-skyMist border border-skyMist/80 shadow-md' 
              : 'bg-white border-2 border-skyMist text-slateAsh hover:bg-skyMist/40'
          }`}
        >
          <div className="flex items-end gap-0.5 h-3 w-3.5">
            <span className={`w-1 bg-slateAsh rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse' : 'h-1.5'}`} />
            <span className={`w-1 bg-slateAsh rounded-full transition-all duration-300 ${isPlaying ? 'h-2 animate-bounce' : 'h-2.5'}`} />
            <span className={`w-1 bg-slateAsh rounded-full transition-all duration-300 ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
          </div>
          <span className="hidden md:inline truncate max-w-[110px]">
            {isPlaying ? (activeTrack?.title || 'Playing') : 'Play Tunes'}
          </span>
        </button>

      </nav>
    </header>
  );
}
