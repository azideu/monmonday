import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrapbookBoard from './components/ScrapbookBoard.jsx';
import LetterModal from './components/LetterModal.jsx';
import AudioWelcomeModal from './components/AudioWelcomeModal.jsx';
import FluidCursor from './components/FluidCursor.jsx';
import { birthdayConfig } from './data/content.js';

export default function App() {
  const { celebrant, playlist, letters, polaroids, celebration, sideMargins } = birthdayConfig;

  // Fluid Cursor State (defaults to true)
  const [isFluidEnabled, setIsFluidEnabled] = useState(true);

  // Audio Player State (persisted across refreshes in localStorage)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('mon_audio_volume');
      return saved !== null ? parseFloat(saved) : 0.7;
    } catch {
      return 0.7;
    }
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    try {
      return localStorage.getItem('mon_welcomed') !== 'true';
    } catch {
      return true;
    }
  });

  // Active modal for letter reading
  const [activeLetter, setActiveLetter] = useState(null);

  // References for Audio
  const audioRef = useRef(null);
  const letterAudioRef = useRef(null);
  const wasBgPlayingBeforeLetter = useRef(false);
  const [isLetterAudioPlaying, setIsLetterAudioPlaying] = useState(false);
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
      if (letterAudioRef.current) {
        letterAudioRef.current.pause();
      }
    };
  }, []);

  // Update track source when index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying && !letterAudioRef.current) {
        audioRef.current.play().catch(() => {
          startSynthChimes();
        });
      }
    }
  }, [currentTrackIndex]);

  // Update volume for background player and any active letter audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (letterAudioRef.current) {
      letterAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle letter dedicated audio playback & background player coordination
  useEffect(() => {
    const letterAudioSource = activeLetter?.audioUrl || activeLetter?.audio;

    if (activeLetter && letterAudioSource) {
      // 1. If background music is playing, pause it gracefully and remember state
      if (isPlaying) {
        wasBgPlayingBeforeLetter.current = true;
        if (audioRef.current) {
          audioRef.current.pause();
        }
        stopSynthChimes();
        setIsPlaying(false);
      } else {
        wasBgPlayingBeforeLetter.current = false;
      }

      // 2. Stop any existing letter audio instance
      if (letterAudioRef.current) {
        letterAudioRef.current.pause();
        letterAudioRef.current = null;
      }

      // 3. Create and play letter audio
      const letterAudio = new Audio(letterAudioSource);
      letterAudio.volume = volume;
      letterAudioRef.current = letterAudio;

      letterAudio.onplay = () => setIsLetterAudioPlaying(true);
      letterAudio.onpause = () => setIsLetterAudioPlaying(false);
      letterAudio.onended = () => setIsLetterAudioPlaying(false);

      letterAudio.play().catch((err) => {
        console.warn("Letter audio autoplay prevented or blocked:", err);
      });
    } else if (!activeLetter) {
      // Letter closed: stop letter audio
      if (letterAudioRef.current) {
        letterAudioRef.current.pause();
        letterAudioRef.current = null;
      }
      setIsLetterAudioPlaying(false);

      // Resume background music if it was playing before opening the letter
      if (wasBgPlayingBeforeLetter.current) {
        wasBgPlayingBeforeLetter.current = false;
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(true);
            startSynthChimes();
          });
        }
      }
    }
    // Note: If activeLetter is open but has NO audio, do nothing!
    // Background audio continues playing smoothly and uninterrupted without muting.
  }, [activeLetter]);

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
    try {
      localStorage.setItem('mon_welcomed', 'true');
    } catch {}
    setShowWelcomeModal(false);
    togglePlay();
  };

  const handleExploreSilently = () => {
    try {
      localStorage.setItem('mon_welcomed', 'true');
    } catch {}
    setShowWelcomeModal(false);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    try {
      localStorage.setItem('mon_audio_volume', String(newVolume));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-scrapbook-pattern relative text-slateAsh selection:bg-buttercup selection:text-slateAsh">
      
      {/* Interactive WebGL Fluid Cursor (Soft #D4F1FF Sky Mist) */}
      <FluidCursor
        enabled={isFluidEnabled}
        densityDissipation={4.8}
        velocityDissipation={2.5}
        pressure={0.1}
        curl={2}
        splatRadius={0.14}
        splatForce={3500}
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
        onVolumeChange={handleVolumeChange}
        polaroids={polaroids}
        letters={letters}
        onOpenLetter={(letter) => setActiveLetter(letter)}
        celebration={celebration}
        sideMargins={sideMargins}
        isFluidEnabled={isFluidEnabled}
        onToggleFluid={() => setIsFluidEnabled((prev) => !prev)}
      />

      {/* Letter Unfold Modal */}
      <LetterModal
        letter={activeLetter}
        isOpen={Boolean(activeLetter)}
        onClose={() => setActiveLetter(null)}
        celebrantName={celebrant.name}
        isLetterAudioPlaying={isLetterAudioPlaying}
        onToggleLetterAudio={() => {
          if (!letterAudioRef.current) return;
          if (isLetterAudioPlaying) {
            letterAudioRef.current.pause();
          } else {
            letterAudioRef.current.play().catch(console.warn);
          }
        }}
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
