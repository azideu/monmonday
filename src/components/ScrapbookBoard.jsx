import React from 'react';
import CassettePlayer from './CassettePlayer.jsx';
import PolaroidCard from './PolaroidCard.jsx';
import LetterEnvelope from './LetterEnvelope.jsx';
import BirthdayCake from './BirthdayCake.jsx';
import { Heart, Waves } from 'lucide-react';

export default function ScrapbookBoard({
  celebrant,
  playlist,
  currentTrackIndex,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  volume,
  onVolumeChange,
  polaroids,
  letters,
  onOpenLetter,
  celebration,
  isFluidEnabled,
  onToggleFluid,
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-16">

      {/* Scrapbook Hero Banner */}
      <section className="relative text-center pt-8 pb-6 select-none">

        {/* Floating background decorative doodle badges */}
        <div className="absolute top-2 left-6 hidden lg:block rotate-[-8deg] bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90">
          September 2026
        </div>
        <div className="absolute top-4 right-8 hidden lg:block rotate-[6deg] bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90">
          Happy Birthday!
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slateAsh tracking-tight font-serifDisplay mb-3">
          {celebrant.title}
        </h1>

        <p className="text-base sm:text-lg text-slateAsh/70 max-w-2xl mx-auto font-sans leading-relaxed">
          {celebrant.subtitle}
        </p>

        {/* Subtle decorative divider with heart */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="w-16 h-0.5 bg-skyMist/80 rounded-full" />
          <Heart className="w-4 h-4 fill-skyMist text-slateAsh/60" />
          <div className="w-16 h-0.5 bg-skyMist/80 rounded-full" />
        </div>

        {/* Fluid Effect Toggle Switch & Hint */}
        <div className="flex flex-col items-center justify-center gap-2 mt-5">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-full border border-skyMist shadow-paper-sm text-xs sm:text-sm font-semibold text-slateAsh">
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-slateAsh" />
              Enable Effect
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isFluidEnabled}
              onClick={onToggleFluid}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isFluidEnabled ? 'bg-skyMist border-skyMist/80' : 'bg-slateAsh/25'
              }`}
            >
              <span className="sr-only">Enable effect</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-paper-sm border border-slateAsh/15 transition-transform duration-200 ease-in-out ${
                  isFluidEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {isFluidEnabled && (
            <span className="text-xs sm:text-sm font-handwriting text-slateAsh/70 tracking-wide transition-opacity duration-300">
              Hover anywhere
            </span>
          )}
        </div>
      </section>

      {/* SECTION 1: Scattered Polaroids Gallery (Leading with Memories) */}
      <section id="photos-section" className="relative pt-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-serifDisplay">
            Favorite memories
          </h2>
          <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
            Click any photo to flip it over and read the note on the back.
          </p>
        </div>

        {/* Polaroids Grid / Scatter */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10">
          {polaroids.map((photo, index) => (
            <PolaroidCard
              key={photo.id || index}
              photo={photo}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: Letters & Envelopes */}
      <section id="letters-section" className="relative pt-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-serifDisplay">
            Letters for you
          </h2>
          <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
            Click an envelope to open the letter.
          </p>
        </div>

        {/* Envelopes Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10">
          {letters.map((letter, index) => (
            <LetterEnvelope
              key={letter.id || index}
              letter={letter}
              index={index}
              onOpenLetter={onOpenLetter}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: Mixtape / Soundtrack Station */}
      <section id="mixtape-section" className="relative pt-4">
        <CassettePlayer
          playlist={playlist}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onNextTrack={onNextTrack}
          onPrevTrack={onPrevTrack}
          volume={volume}
          onVolumeChange={onVolumeChange}
        />
      </section>

      {/* SECTION 4: Birthday Candle & Cake */}
      <section id="cake-section" className="pt-4">
        <BirthdayCake
          celebration={celebration}
          celebrantName={celebrant.name}
        />
      </section>

      {/* Footer */}
      <footer className="text-center pt-12 pb-6 border-t border-dashed border-slateAsh/20">
        <div className="flex items-center justify-center gap-1.5 text-sm text-slateAsh font-sans font-medium">
          <span>Happy birthday, {celebrant.name}.</span>
          <Heart className="w-4 h-4 fill-coralBlush text-coralBlush inline ml-0.5" />
        </div>
        <p className="text-xs text-slateAsh/60 mt-1 font-sans">
          From your monlings.
        </p>
      </footer>

    </main>
  );
}
