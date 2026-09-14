import React from 'react';
import CassettePlayer from './CassettePlayer.jsx';
import PolaroidCard from './PolaroidCard.jsx';
import LetterEnvelope from './LetterEnvelope.jsx';
import BirthdayCake from './BirthdayCake.jsx';
import { Sparkles, Camera, Mail, Heart, Music } from 'lucide-react';

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
}) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-16">
      
      {/* Scrapbook Hero Banner */}
      <section className="relative text-center pt-8 pb-6 select-none">
        
        {/* Floating background decorative doodle badges */}
        <div className="absolute top-2 left-6 hidden lg:block rotate-[-8deg] bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90">
          ✨ Special Edition 2026
        </div>
        <div className="absolute top-4 right-8 hidden lg:block rotate-[6deg] bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90">
          🎈 Another year of joy!
        </div>

        {/* Hero title badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skyMist border-2 border-skyMist/80 text-xs font-bold text-slateAsh mb-3 shadow-paper-sm">
          <Sparkles className="w-3.5 h-3.5 text-slateAsh" />
          <span>Celebrating {celebrant.name}'s Birthday</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slateAsh tracking-tight font-sans mb-3">
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
      </section>

      {/* SECTION 1: Mixtape / Music Corner */}
      <section className="relative">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyMist/80 border border-skyMist text-xs font-bold uppercase tracking-widest text-slateAsh shadow-paper-sm">
            <Music className="w-3.5 h-3.5 text-slateAsh" />
            <span>The Birthday Soundtrack</span>
          </div>
        </div>
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

      {/* SECTION 2: Scattered Polaroids Gallery */}
      <section id="photos-section" className="relative pt-6">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-skyMist border-2 border-skyMist/80 text-xs font-bold text-slateAsh mb-2 shadow-paper-sm">
            <Camera className="w-3.5 h-3.5 text-slateAsh" />
            <span>Captured Moments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-sans">
            Memories Through the Years
          </h2>
          <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
            Click any polaroid to flip it over and read the memory written on the back!
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

      {/* SECTION 3: Letters & Envelopes */}
      <section id="letters-section" className="relative pt-8">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-skyMist border-2 border-skyMist/80 text-xs font-bold text-slateAsh mb-2 shadow-paper-sm">
            <Mail className="w-3.5 h-3.5 text-slateAsh" />
            <span>Letters from Loved Ones</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-sans">
            Sealed with Love
          </h2>
          <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
            Click on any envelope to break the seal and unfold their letter.
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

      {/* SECTION 4: Birthday Candle & Cake */}
      <section className="pt-4">
        <BirthdayCake
          celebration={celebration}
          celebrantName={celebrant.name}
        />
      </section>

      {/* Footer */}
      <footer className="text-center pt-12 pb-6 border-t border-dashed border-slateAsh/20">
        <div className="flex items-center justify-center gap-1.5 text-sm text-slateAsh/70 font-sans">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 fill-coralBlush text-coralBlush inline" />
          <span>for {celebrant.name}'s special day • 2026</span>
        </div>
        <p className="text-xs text-slateAsh/40 mt-1 font-sans">
          Always remember how deeply you are loved and celebrated.
        </p>
      </footer>

    </main>
  );
}
