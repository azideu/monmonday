import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrapbookBoard from './components/ScrapbookBoard.jsx';
import LetterModal from './components/LetterModal.jsx';
import SecretLetterModal from './components/SecretLetterModal.jsx';
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

  // Active modal for letter reading & tracking read letters
  const [activeLetter, setActiveLetter] = useState(null);
  const [readLetterIds, setReadLetterIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mon_read_letters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Password-protected secret letters state & unlock modal
  const [unlockedLetterIds, setUnlockedLetterIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mon_unlocked_letters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [secretUnlockLetter, setSecretUnlockLetter] = useState(null);

  const handleOpenLetter = (letter) => {
    if (!letter) return;
    const isLocked = Boolean(
      letter.password && !unlockedLetterIds.includes(letter.id || letter.author)
    );
    if (isLocked) {
      setSecretUnlockLetter(letter);
      return;
    }

    setActiveLetter(letter);
    const letterId = letter.id || letter.author;
    if (letterId) {
      setReadLetterIds((prev) => {
        if (prev.includes(letterId)) return prev;
        const updated = [...prev, letterId];
        try {
          localStorage.setItem('mon_read_letters', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleUnlockSuccess = (letter) => {
    if (!letter) return;
    const letterId = letter.id || letter.author;
    if (letterId && !unlockedLetterIds.includes(letterId)) {
      const updated = [...unlockedLetterIds, letterId];
      setUnlockedLetterIds(updated);
      try {
        localStorage.setItem('mon_unlocked_letters', JSON.stringify(updated));
      } catch {}
    }
    setSecretUnlockLetter(null);
    setActiveLetter(letter);
    if (letterId) {
      setReadLetterIds((prev) => {
        if (prev.includes(letterId)) return prev;
        const updated = [...prev, letterId];
        try {
          localStorage.setItem('mon_read_letters', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const currentLetterIndex = activeLetter
    ? letters.findIndex((l) => (l.id || l.author) === (activeLetter.id || activeLetter.author))
    : -1;

  const handlePrevLetter = () => {
    if (currentLetterIndex > 0) {
      const prevLetter = letters[currentLetterIndex - 1];
      const isLocked = Boolean(
        prevLetter.password && !unlockedLetterIds.includes(prevLetter.id || prevLetter.author)
      );
      if (isLocked) {
        setActiveLetter(null);
        setSecretUnlockLetter(prevLetter);
      } else {
        handleOpenLetter(prevLetter);
      }
    }
  };

  const handleNextLetter = () => {
    if (currentLetterIndex >= 0 && currentLetterIndex < letters.length - 1) {
      const nextLetter = letters[currentLetterIndex + 1];
      const isLocked = Boolean(
        nextLetter.password && !unlockedLetterIds.includes(nextLetter.id || nextLetter.author)
      );
      if (isLocked) {
        setActiveLetter(null);
        setSecretUnlockLetter(nextLetter);
      } else {
        handleOpenLetter(nextLetter);
      }
    }
  };

  // References for Audio & Smooth Transitions
  const audioRef = useRef(null);
  const letterAudioRef = useRef(null);
  const wasBgPlayingBeforeLetter = useRef(false);
  const bgFadeIntervalRef = useRef(null);
  const letterFadeIntervalRef = useRef(null);
  const isTransitioningAudioRef = useRef(false);
  const [isLetterAudioPlaying, setIsLetterAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Normalization ceiling: -1.0 dBFS ceiling (10^(-1/20) ≈ 0.89125)
  // Ensures any loaded audio file automatically stays within -1.0 dB without digital clipping
  const NORMALIZED_CEILING_GAIN = Math.pow(10, -1 / 20); // ~0.89125
  const getNormalizedVol = (v) => Math.max(0, Math.min(NORMALIZED_CEILING_GAIN, v * NORMALIZED_CEILING_GAIN));

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Helper to smoothly fade audio volume over a specified duration (ms) with -1.0 dB ceiling normalization
  const fadeAudio = (audioEl, fromVol, toVol, duration = 800, onComplete) => {
    if (!audioEl) {
      if (onComplete) onComplete();
      return null;
    }

    const startVol = Math.max(0, Math.min(NORMALIZED_CEILING_GAIN, fromVol));
    const targetVol = Math.max(0, Math.min(NORMALIZED_CEILING_GAIN, toVol));
    const steps = 24;
    const intervalTime = Math.max(16, Math.floor(duration / steps));
    const volStep = (targetVol - startVol) / steps;
    let currentStep = 0;

    audioEl.volume = startVol;

    const timer = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(NORMALIZED_CEILING_GAIN, startVol + volStep * currentStep));
      try {
        audioEl.volume = nextVol;
      } catch {}

      if (currentStep >= steps) {
        clearInterval(timer);
        try {
          audioEl.volume = targetVol;
        } catch {}
        if (onComplete) onComplete();
      }
    }, intervalTime);

    return timer;
  };

  const clearBgFade = () => {
    if (bgFadeIntervalRef.current) {
      clearInterval(bgFadeIntervalRef.current);
      bgFadeIntervalRef.current = null;
    }
  };

  const clearLetterFade = () => {
    if (letterFadeIntervalRef.current) {
      clearInterval(letterFadeIntervalRef.current);
      letterFadeIntervalRef.current = null;
    }
  };

  // Initialize HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = currentTrack.audioUrl;
    audio.volume = getNormalizedVol(volume);
    audio.loop = false;

    // Track finished -> auto advance
    audio.onended = () => {
      handleNextTrack();
    };

    // Track real playback position
    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime || 0);
    };

    const updateAudioDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };

    audio.onloadedmetadata = updateAudioDuration;
    audio.ondurationchange = updateAudioDuration;

    // Fallback on error -> start peaceful synthesized acoustic chimes
    audio.onerror = () => {
      console.warn("External audio source blocked or unavailable, switching to synth chimes fallback.");
      if (isPlaying) {
        startSynthChimes();
      }
    };

    audioRef.current = audio;

    return () => {
      clearBgFade();
      clearLetterFade();
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
      setAudioCurrentTime(0);
      if (currentTrack?.duration) {
        const parts = currentTrack.duration.split(':');
        if (parts.length === 2) {
          const parsed = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
          if (!isNaN(parsed) && parsed > 0) {
            setAudioDuration(parsed);
          }
        }
      }
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying && !letterAudioRef.current) {
        audioRef.current.volume = getNormalizedVol(volume);
        audioRef.current.play().catch(() => {
          startSynthChimes();
        });
      }
    }
  }, [currentTrackIndex]);

  // Update volume for background player and any active letter audio when volume slider adjusts
  useEffect(() => {
    if (!isTransitioningAudioRef.current) {
      const normalizedVol = getNormalizedVol(volume);
      if (audioRef.current) {
        audioRef.current.volume = normalizedVol;
      }
      if (letterAudioRef.current) {
        letterAudioRef.current.volume = normalizedVol;
      }
    }
  }, [volume]);

  // Handle letter dedicated audio playback & background player smooth transition
  useEffect(() => {
    const letterAudioSource = activeLetter?.audioUrl || activeLetter?.audio;

    if (activeLetter && letterAudioSource) {
      isTransitioningAudioRef.current = true;
      clearBgFade();
      clearLetterFade();

      // 1. Check if background music is active
      const bgWasPlaying = isPlaying || Boolean(synthIntervalRef.current);
      if (bgWasPlaying) {
        wasBgPlayingBeforeLetter.current = true;
      } else {
        wasBgPlayingBeforeLetter.current = false;
      }

      // Stop any prior letter audio
      if (letterAudioRef.current) {
        letterAudioRef.current.pause();
        letterAudioRef.current = null;
      }

      // 2. Prepare new letter audio starting from volume 0
      const letterAudio = new Audio(letterAudioSource);
      letterAudio.volume = 0;
      letterAudioRef.current = letterAudio;

      letterAudio.onplay = () => setIsLetterAudioPlaying(true);
      letterAudio.onpause = () => {
        if (!isTransitioningAudioRef.current) {
          setIsLetterAudioPlaying(false);
        }
      };
      letterAudio.onended = () => {
        setIsLetterAudioPlaying(false);
      };

      // 3. Smooth Crossfade: Fade out background music while fading in letter audio
      if (bgWasPlaying && audioRef.current && !audioRef.current.paused) {
        const currentBgVol = audioRef.current.volume;
        bgFadeIntervalRef.current = fadeAudio(audioRef.current, currentBgVol, 0, 700, () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = getNormalizedVol(volume);
          }
          stopSynthChimes();
          setIsPlaying(false);
        });
      } else {
        stopSynthChimes();
        setIsPlaying(false);
      }

      // Play and fade in letter audio with subtle delay for organic crossfade warmth
      setTimeout(() => {
        if (letterAudioRef.current === letterAudio) {
          letterAudio.play().then(() => {
            setIsLetterAudioPlaying(true);
            letterFadeIntervalRef.current = fadeAudio(letterAudio, 0, getNormalizedVol(volume), 800, () => {
              isTransitioningAudioRef.current = false;
            });
          }).catch((err) => {
            console.warn("Letter audio play prevented:", err);
            isTransitioningAudioRef.current = false;
          });
        }
      }, 150);

    } else if (activeLetter && !letterAudioSource) {
      // Switching from a letter that had audio to one without audio:
      if (letterAudioRef.current) {
        clearLetterFade();
        letterAudioRef.current.pause();
        letterAudioRef.current = null;
        setIsLetterAudioPlaying(false);
      }
      if (wasBgPlayingBeforeLetter.current && audioRef.current && audioRef.current.paused) {
        wasBgPlayingBeforeLetter.current = false;
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          bgFadeIntervalRef.current = fadeAudio(audioRef.current, 0, getNormalizedVol(volume), 900, () => {
            isTransitioningAudioRef.current = false;
          });
        }).catch(() => {
          setIsPlaying(true);
          startSynthChimes();
          isTransitioningAudioRef.current = false;
        });
      }
    } else if (!activeLetter) {
      // Letter modal closed
      isTransitioningAudioRef.current = true;
      clearBgFade();
      clearLetterFade();

      const endingLetterAudio = letterAudioRef.current;
      const shouldResumeBg = wasBgPlayingBeforeLetter.current;
      wasBgPlayingBeforeLetter.current = false;

      // 1. Smoothly fade out letter audio
      if (endingLetterAudio && !endingLetterAudio.paused) {
        const currentLetterVol = endingLetterAudio.volume;
        letterFadeIntervalRef.current = fadeAudio(endingLetterAudio, currentLetterVol, 0, 600, () => {
          endingLetterAudio.pause();
          if (letterAudioRef.current === endingLetterAudio) {
            letterAudioRef.current = null;
          }
          setIsLetterAudioPlaying(false);
        });
      } else {
        if (endingLetterAudio) {
          endingLetterAudio.pause();
          letterAudioRef.current = null;
        }
        setIsLetterAudioPlaying(false);
      }

      // 2. Smoothly resume and fade in background music if it was previously playing
      if (shouldResumeBg && audioRef.current) {
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          bgFadeIntervalRef.current = fadeAudio(audioRef.current, 0, getNormalizedVol(volume), 900, () => {
            isTransitioningAudioRef.current = false;
          });
        }).catch(() => {
          setIsPlaying(true);
          startSynthChimes();
          isTransitioningAudioRef.current = false;
        });
      } else {
        isTransitioningAudioRef.current = false;
      }
    }
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

        const targetVol = getNormalizedVol(volume) * 0.15;
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

  const handleSeek = (targetSeconds) => {
    if (audioRef.current) {
      const maxDur = audioDuration || audioRef.current.duration || 0;
      const clamped = Math.max(0, Math.min(maxDur > 0 ? maxDur : targetSeconds, targetSeconds));
      audioRef.current.currentTime = clamped;
      setAudioCurrentTime(clamped);
    }
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
        currentTime={audioCurrentTime}
        duration={audioDuration}
        onSeek={handleSeek}
        polaroids={polaroids}
        letters={letters}
        onOpenLetter={handleOpenLetter}
        celebration={celebration}
        sideMargins={sideMargins}
        isFluidEnabled={isFluidEnabled}
        onToggleFluid={() => setIsFluidEnabled((prev) => !prev)}
        readLetterIds={readLetterIds}
        unlockedLetterIds={unlockedLetterIds}
      />

      {/* Secret Letter Password Unlock Modal */}
      <SecretLetterModal
        letter={secretUnlockLetter}
        isOpen={Boolean(secretUnlockLetter)}
        onClose={() => setSecretUnlockLetter(null)}
        onUnlock={handleUnlockSuccess}
      />

      {/* Letter Unfold Modal */}
      <LetterModal
        letter={activeLetter}
        isOpen={Boolean(activeLetter)}
        onClose={() => setActiveLetter(null)}
        celebrantName={celebrant.name}
        isLetterAudioPlaying={isLetterAudioPlaying}
        hasPrev={currentLetterIndex > 0}
        hasNext={currentLetterIndex >= 0 && currentLetterIndex < letters.length - 1}
        onPrevLetter={handlePrevLetter}
        onNextLetter={handleNextLetter}
        letterIndex={currentLetterIndex}
        totalLetters={letters.length}
        onToggleLetterAudio={() => {
          if (!letterAudioRef.current) return;
          clearLetterFade();
          if (isLetterAudioPlaying) {
            const curVol = letterAudioRef.current.volume;
            letterFadeIntervalRef.current = fadeAudio(letterAudioRef.current, curVol, 0, 400, () => {
              if (letterAudioRef.current) {
                letterAudioRef.current.pause();
                letterAudioRef.current.volume = getNormalizedVol(volume);
              }
              setIsLetterAudioPlaying(false);
            });
          } else {
            letterAudioRef.current.volume = 0;
            letterAudioRef.current.play().then(() => {
              setIsLetterAudioPlaying(true);
              letterFadeIntervalRef.current = fadeAudio(letterAudioRef.current, 0, getNormalizedVol(volume), 500);
            }).catch(console.warn);
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
