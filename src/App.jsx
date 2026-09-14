import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrapbookBoard from './components/ScrapbookBoard.jsx';
import LetterModal from './components/LetterModal.jsx';
import AudioWelcomeModal from './components/AudioWelcomeModal.jsx';
import FluidCursor from './components/FluidCursor.jsx';
import { birthdayConfig } from './data/content.js';

export default function App() {
  const { celebrant, playlist, letters, polaroids, celebration } = birthdayConfig;

  // Fluid Cursor State (defaults to true)
  const [isFluidEnabled, setIsFluidEnabled] = useState(true);

  // Audio Player State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // Active modal for letter reading
  const [activeLetter, setActiveLetter] = useState(null);

  // References for Audio
  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Initialize HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = currentTrack.audioUrl;
    audio.volume = volume;
    audio.loop = false;

    // Track finished -> auto advance
    audio.onended = () => {
      handleNextTrack();
    };

    // Fallback on error -> start peaceful synthesized acoustic chimes
    audio.onerror = () => {
      console.warn("External audio source blocked or unavailable, switching to synth chimes fallback.");
      if (isPlaying) {
        startSynthChimes();
      }
    };

    audioRef.current = audio;

    return () => {
      audio.pause();
      stopSynthChimes();
    };
  }, []);

  // Update track source when index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          startSynthChimes();
        });
      }
    }
  }, [currentTrackIndex]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Peaceful synthesized chime fallback using Web Audio API
  const startSynthChimes = () => {
    stopSynthChimes();
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Soothing pentatonic scale frequencies (C, D, E, G, A)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let step = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!isPlaying && step > 0) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = notes[step % notes.length];
        step = (step + 1) % notes.length;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const targetVol = volume * 0.15;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.6);
      }, 1200);
    } catch (e) {
      console.warn("Web Audio fallback error:", e);
    }
  };

  const stopSynthChimes = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSynthChimes();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If browser or URL blocks, use synth chimes
          setIsPlaying(true);
          startSynthChimes();
        });
      } else {
        setIsPlaying(true);
        startSynthChimes();
      }
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Welcome modal handlers
  const handleStartWithMusic = () => {
    setShowWelcomeModal(false);
    togglePlay();
  };

  const handleExploreSilently = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="min-h-screen bg-scrapbook-pattern relative text-slateAsh selection:bg-buttercup selection:text-slateAsh">
      
      {/* Interactive WebGL Fluid Cursor (#D4F1FF Sky Mist only) */}
      <FluidCursor
        enabled={isFluidEnabled}
        densityDissipation={3.5}
        velocityDissipation={2}
        pressure={0.1}
        curl={3}
        splatRadius={0.2}
        splatForce={6000}
        transparent={true}
      />

      {/* Top Floating Navbar */}
      <Navbar
        celebrant={celebrant}
        isPlaying={isPlaying}
        onToggleMusic={togglePlay}
        activeTrack={currentTrack}
        isFluidEnabled={isFluidEnabled}
        onToggleFluid={() => setIsFluidEnabled((prev) => !prev)}
      />

      {/* Main Scrapbook Board */}
      <ScrapbookBoard
        celebrant={celebrant}
        playlist={playlist}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        volume={volume}
        onVolumeChange={setVolume}
        polaroids={polaroids}
        letters={letters}
        onOpenLetter={(letter) => setActiveLetter(letter)}
        celebration={celebration}
        isFluidEnabled={isFluidEnabled}
        onToggleFluid={() => setIsFluidEnabled((prev) => !prev)}
      />

      {/* Letter Unfold Modal */}
      <LetterModal
        letter={activeLetter}
        isOpen={Boolean(activeLetter)}
        onClose={() => setActiveLetter(null)}
      />

      {/* Audio Autoplay primer modal */}
      <AudioWelcomeModal
        isOpen={showWelcomeModal}
        celebrantName={celebrant.name}
        onStartWithMusic={handleStartWithMusic}
        onExploreSilently={handleExploreSilently}
      />

    </div>
  );
}
