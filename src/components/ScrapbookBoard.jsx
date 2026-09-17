import React, { useState, lazy, Suspense } from 'react';
import CassettePlayer from './CassettePlayer.jsx';
import PolaroidCard from './PolaroidCard.jsx';
import LetterEnvelope from './LetterEnvelope.jsx';
import BirthdayCake from './BirthdayCake.jsx';
import ScrapbookDecoMargin from './ScrapbookDecoMargin.jsx';
import MobileKeepsakesTray from './MobileKeepsakesTray.jsx';
import { Heart } from 'lucide-react';
import { useReveal } from '../hooks/useReveal.js';

const MomentLightboxModal = lazy(() => import('./MomentLightboxModal.jsx'));

/**
 * Split a string into <span> elements for the inkDrop word-by-word entrance.
 * Each word gets a staggered delay. The title typically has 3–6 words so
 * delays stay well under 600 ms total — fast enough to feel instant,
 * slow enough to feel handwritten.
 */
function InkDropTitle({ text, className }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="hero-word"
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

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
  currentTime = 0,
  duration = 0,
  onSeek,
  polaroids,
  letters,
  onOpenLetter,
  celebration,
  sideMargins,
  isFluidEnabled,
  onToggleFluid,
  readLetterIds = [],
  unlockedLetterIds = [],
}) {
  // Section scroll-reveal refs
  const photosRef = useReveal();
  const lettersRef = useReveal();
  const mixtapeRef = useReveal();
  const cakeRef = useReveal();

  // Lightbox modal state for expanding central polaroid moments
  const [expandedMomentIndex, setExpandedMomentIndex] = useState(null);

  const handleExpandPhoto = (photo, index) => {
    setExpandedMomentIndex(index);
  };

  const handleCloseLightbox = () => {
    setExpandedMomentIndex(null);
  };

  const handlePrevMoment = () => {
    setExpandedMomentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextMoment = () => {
    setExpandedMomentIndex((prev) => (prev < polaroids.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Decorative desktop side margins with photos & playful ephemera */}
      <ScrapbookDecoMargin side="left" items={sideMargins?.left} />
      <ScrapbookDecoMargin side="right" items={sideMargins?.right} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 space-y-16 relative z-10">

        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <section className="relative text-center pt-8 pb-6 select-none">

          {/* Floating doodle badges — gentle continuous float */}
          <div
            className="absolute top-2 left-6 hidden lg:block hero-badge hero-badge-left bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90"
          >
            18/9/2004
          </div>
          <div
            className="absolute top-4 right-8 hidden lg:block hero-badge hero-badge-right bg-skyMist text-slateAsh px-3.5 py-1.5 rounded-full text-xs font-handwriting font-bold shadow-paper-sm border border-skyMist/90"
          >
            Happy Birthday!
          </div>

          {/* Title: ink-drop word-by-word entrance */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slateAsh tracking-tight font-serifDisplay mb-3">
            <InkDropTitle text={celebrant.title} />
          </h1>

          {/* Subtitle: fades in after title settles */}
          <p className="hero-subtitle text-base sm:text-lg text-slateAsh/70 max-w-2xl mx-auto font-sans leading-relaxed">
            {celebrant.subtitle}
          </p>

          {/* Divider: lines draw outward, heart pulses once */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-16 h-0.5 bg-skyMist/80 rounded-full hero-divider-line hero-divider-line-left" />
            <Heart className="w-4 h-4 fill-skyMist text-slateAsh/60 hero-divider-heart" />
            <div className="w-16 h-0.5 bg-skyMist/80 rounded-full hero-divider-line hero-divider-line-right" />
          </div>
        </section>

        {/* ── Section 1: Polaroid Memories ──────────────────────── */}
        <section
          id="photos-section"
          ref={photosRef}
          className="section-reveal relative pt-2"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-serifDisplay">
              Favourite memories
            </h2>
            <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
              Click any photo to expand full view, or click the caption to flip and read the note.
            </p>
          </div>

          {/* Polaroids Grid */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10">
            {polaroids.map((photo, index) => (
              <PolaroidCard
                key={photo.id || index}
                photo={photo}
                index={index}
                onExpandPhoto={handleExpandPhoto}
              />
            ))}
          </div>

          {/* ── Mobile/Tablet Adaptation: Desk Keepsakes & Ephemera Shelf (<1280px) ── */}
          <MobileKeepsakesTray
            leftItems={sideMargins?.left}
            rightItems={sideMargins?.right}
          />
        </section>

        {/* ── Section 2: Letters ────────────────────────────────── */}
        <section
          id="letters-section"
          ref={lettersRef}
          className="section-reveal delay-1 relative pt-4"
        >
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
            {letters.map((letter, index) => {
              const isLocked = Boolean(
                letter.password && !unlockedLetterIds.includes(letter.id || letter.author)
              );
              return (
                <LetterEnvelope
                  key={letter.id || index}
                  letter={letter}
                  index={index}
                  onOpenLetter={onOpenLetter}
                  defaultRecipient={celebrant?.name || "Monmonkyu"}
                  isRead={readLetterIds.includes(letter.id || letter.author)}
                  isLocked={isLocked}
                />
              );
            })}
          </div>
        </section>

        {/* ── Section 3: Birthday Mixtape ───────────────────────── */}
        <section
          id="mixtape-section"
          ref={mixtapeRef}
          className="section-reveal delay-2 relative pt-4"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slateAsh tracking-tight font-serifDisplay">
              Birthday mixtape
            </h2>
            <p className="text-xs sm:text-sm text-slateAsh/60 mt-1 font-sans">
              Curated birthday tunes and serenades recorded for your day.
            </p>
          </div>
          <CassettePlayer
            playlist={playlist}
            letters={letters}
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            onNextTrack={onNextTrack}
            onPrevTrack={onPrevTrack}
            volume={volume}
            onVolumeChange={onVolumeChange}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </section>

        {/* ── Section 4: Birthday Cake ──────────────────────────── */}
        <section
          id="cake-section"
          ref={cakeRef}
          className="section-reveal delay-3 pt-4"
        >
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

      {/* Lightbox Modal for Full Image Expansion (Code-split) */}
      <Suspense fallback={null}>
        <MomentLightboxModal
          moment={expandedMomentIndex !== null ? polaroids[expandedMomentIndex] : null}
          isOpen={expandedMomentIndex !== null}
          onClose={handleCloseLightbox}
          onPrev={handlePrevMoment}
          onNext={handleNextMoment}
          currentIndex={expandedMomentIndex ?? 0}
          totalCount={polaroids.length}
          hasPrev={expandedMomentIndex !== null && expandedMomentIndex > 0}
          hasNext={expandedMomentIndex !== null && expandedMomentIndex < polaroids.length - 1}
        />
      </Suspense>
    </div>
  );
}
