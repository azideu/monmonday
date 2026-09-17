import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Activity, Download, Check, Loader2, Music } from 'lucide-react';
import JSZip from 'jszip';
import { playDeckClick } from '../utils/soundEffects.js';

export default function CassettePlayer({
  playlist = [],
  letters = [],
  currentTrackIndex = 0,
  isPlaying = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  volume = 0.7,
  onVolumeChange,
  currentTime = 0,
  duration = 0,
  onSeek,
}) {
  const currentTrack = playlist[currentTrackIndex] || playlist[0];
  const [isMuted, setIsMuted] = useState(false);
  const [vuLeft, setVuLeft] = useState(15);
  const [vuRight, setVuRight] = useState(20);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [downloadProgress, setDownloadProgress] = useState('');

  // Seeking & Playhead Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverRatio, setHoverRatio] = useState(0);
  const trackRef = useRef(null);

  // Compute effective track duration (HTML5 Audio duration with fallback to metadata duration string)
  const getFallbackDuration = () => {
    if (duration > 0 && !isNaN(duration) && isFinite(duration)) return duration;
    if (currentTrack?.duration) {
      const parts = currentTrack.duration.split(':');
      if (parts.length === 2) {
        const secs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (!isNaN(secs) && secs > 0) return secs;
      }
    }
    return 0;
  };

  const effectiveDuration = getFallbackDuration();
  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = effectiveDuration > 0
    ? Math.min(100, Math.max(0, (displayTime / effectiveDuration) * 100))
    : 0;

  // Format seconds to M:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Mechanical 3-digit counter synced to tape playback position
  const formattedCounter = String(Math.floor(displayTime) % 1000).padStart(3, '0');

  // Seeking interaction handlers
  const getTimeFromEvent = (e) => {
    if (!trackRef.current || effectiveDuration <= 0) return { time: 0, ratio: 0 };
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return { time: ratio * effectiveDuration, ratio };
  };

  const handlePointerDown = (e) => {
    if (effectiveDuration <= 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    const { time } = getTimeFromEvent(e);
    setDragTime(time);
  };

  const handlePointerMove = (e) => {
    if (effectiveDuration <= 0) return;
    const { time, ratio } = getTimeFromEvent(e);
    if (isDragging) {
      setDragTime(time);
    } else {
      setHoverTime(time);
      setHoverRatio(ratio);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    const { time } = getTimeFromEvent(e);
    setIsDragging(false);
    if (onSeek) {
      onSeek(time);
    }
  };

  const handlePointerEnter = (e) => {
    if (effectiveDuration <= 0) return;
    setIsHovering(true);
    const { time, ratio } = getTimeFromEvent(e);
    setHoverTime(time);
    setHoverRatio(ratio);
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
  };

  const handleKeyDown = (e) => {
    if (effectiveDuration <= 0 || !onSeek) return;
    const step = 5;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onSeek(Math.min(effectiveDuration, currentTime + step));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onSeek(Math.max(0, currentTime - step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSeek(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSeek(effectiveDuration);
    }
  };

  const tooltipPercent = isDragging ? progressPercent : (hoverRatio * 100);
  const tooltipTime = isDragging ? dragTime : hoverTime;

  // Audio-reactive VU meter animation
  useEffect(() => {
    let vuInterval;

    if (isPlaying) {
      // Analog VU needle bounce physics
      vuInterval = setInterval(() => {
        const base = volume * 55;
        const jitterL = Math.sin(Date.now() / 140) * 18 + Math.random() * 15;
        const jitterR = Math.cos(Date.now() / 160) * 18 + Math.random() * 15;
        setVuLeft(Math.min(85, Math.max(10, base + jitterL)));
        setVuRight(Math.min(85, Math.max(10, base + jitterR)));
      }, 90);
    } else {
      setVuLeft(5);
      setVuRight(5);
    }

    return () => {
      clearInterval(vuInterval);
    };
  }, [isPlaying, volume]);

  const handlePlayToggle = () => {
    onTogglePlay();
  };

  const handleNext = () => {
    playDeckClick();
    onNextTrack();
  };

  const handlePrev = () => {
    playDeckClick();
    onPrevTrack();
  };

  const handleDownloadZip = async () => {
    if (downloadStatus === 'loading') return;
    playDeckClick();
    setDownloadStatus('loading');
    setDownloadProgress('Preparing...');

    try {
      const zip = new JSZip();

      // Resolve URL relative to the current page base (works with Vite base './')
      const resolveUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return new URL(url, document.baseURI || window.location.href).href;
      };

      // Prepare full track list to download (including akari's electric guitar 1 envelope recording)
      const allTracks = [];

      if (Array.isArray(playlist) && playlist.length > 0) {
        playlist.forEach((track) => {
          // Place Electric Guitar 1 right before Electric Guitar 2 so they are ordered chronologically
          if (track.audioUrl?.includes('akaribdayguitar2') || track.title?.includes('Electric Guitar 2')) {
            allTracks.push({
              title: "Happy Birthday! (But Electric Guitar 1)",
              artist: "akari",
              audioUrl: "./music/akaribdayguitar.mp3",
            });
          }
          allTracks.push(track);
        });
      }

      // Also ensure any other audio from letters is included if not already present
      if (Array.isArray(letters)) {
        letters.forEach((letter) => {
          const letterAudio = letter.audioUrl || letter.audio;
          if (letterAudio && !allTracks.some((t) => t.audioUrl === letterAudio)) {
            allTracks.push({
              title: letter.audioTitle || `${letter.author}'s Audio`,
              artist: letter.author || 'Friend',
              audioUrl: letterAudio,
            });
          }
        });
      }

      // Fallback: ensure Electric Guitar 1 is present
      if (!allTracks.some((t) => t.audioUrl?.includes('akaribdayguitar.mp3'))) {
        allTracks.splice(1, 0, {
          title: "Happy Birthday! (But Electric Guitar 1)",
          artist: "akari",
          audioUrl: "./music/akaribdayguitar.mp3",
        });
      }

      const tracksToZip = allTracks.map((track, index) => {
        const num = String(index + 1).padStart(2, '0');
        const safeTitle = (track.title || `Track ${index + 1}`).replace(/[/\\?%*:|"<>]/g, '-');
        const safeArtist = (track.artist || 'Artist').replace(/[/\\?%*:|"<>]/g, '-');
        return {
          filename: `${num} - ${safeArtist} - ${safeTitle}.mp3`,
          url: track.audioUrl,
          title: track.title,
          artist: track.artist,
        };
      });

      const successfulTracks = [];
      for (let i = 0; i < tracksToZip.length; i++) {
        const item = tracksToZip[i];
        setDownloadProgress(`Zipping track ${i + 1}/${tracksToZip.length}...`);
        try {
          const res = await fetch(resolveUrl(item.url));
          if (res.ok) {
            const blob = await res.blob();
            zip.file(item.filename, blob);
            successfulTracks.push(item);
          } else {
            console.warn(`Could not load audio track: ${item.url}`);
          }
        } catch (err) {
          console.warn(`Error fetching ${item.filename}:`, err);
        }
      }

      if (successfulTracks.length === 0) {
        throw new Error('No audio tracks could be retrieved.');
      }

      // Add a sweet tracklist / birthday message note
      const tracklistNote = [
        "=========================================",
        "           MON'S BDAY PLAYLIST           ",
        "=========================================",
        "",
        "Happy 22nd Birthday, Monmon!",
        "From your monmonlings.",
        "",
        "TRACKLIST:",
        ...successfulTracks.map((t, idx) => `  ${String(idx + 1).padStart(2, '0')}. ${t.artist} - ${t.title}`),
        "",
        "Enjoy the tunes and have the wonderful birthday you deserve! 🩵"
      ].join('\n');

      zip.file('liner-notes.txt', tracklistNote);

      setDownloadProgress('Packaging zip...');
      const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Trigger automatic browser download
      const downloadUrl = URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "mon's bday playlist.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setDownloadStatus('success');
      setDownloadProgress('Downloaded!');
      setTimeout(() => {
        setDownloadStatus('idle');
        setDownloadProgress('');
      }, 3500);
    } catch (error) {
      console.error('Failed to download zip:', error);
      setDownloadStatus('error');
      setDownloadProgress('Failed. Tap to retry');
      setTimeout(() => {
        setDownloadStatus('idle');
        setDownloadProgress('');
      }, 4000);
    }
  };

  return (
    <div className="relative group w-full max-w-md mx-auto">
      {/* Decorative washi tape pinning cassette to board */}
      <div
        className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-buttercup/80 z-20 rounded-sm -rotate-1 border border-amber-200/50"
      />

      {/* Cassette Shell */}
      <div className="relative bg-skyMist border-2 border-slateAsh/20 rounded-2xl p-5 shadow-paper transition-all duration-300 hover:shadow-paper-hover">
        {/* Screw holes in corners */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 stroke-slateAsh/50" strokeWidth="1">
            <line x1="1" y1="1" x2="5" y2="5" />
            <line x1="5" y1="1" x2="1" y2="5" />
          </svg>
        </div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 stroke-slateAsh/50" strokeWidth="1">
            <line x1="1" y1="1" x2="5" y2="5" />
            <line x1="5" y1="1" x2="1" y2="5" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 stroke-slateAsh/50" strokeWidth="1">
            <line x1="1" y1="1" x2="5" y2="5" />
            <line x1="5" y1="1" x2="1" y2="5" />
          </svg>
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 stroke-slateAsh/50" strokeWidth="1">
            <line x1="1" y1="1" x2="5" y2="5" />
            <line x1="5" y1="1" x2="1" y2="5" />
          </svg>
        </div>

        {/* Cassette Label Inset */}
        <div className="bg-white rounded-xl p-3.5 border border-slateAsh/15 shadow-inner-paper">

          {/* Header on label with Analog Dual VU Meter */}
          <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-slateAsh/70 uppercase">
                Side A
              </span>

              {/* Vintage Analog Dual VU Meter Displays */}
              <div className="flex items-center gap-1.5 bg-cloudWhite px-2 py-0.5 rounded border border-slateAsh/20 shadow-inner">
                {/* VU Left */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono font-bold text-slateAsh/60">L</span>
                  <div className="w-9 h-2.5 bg-slateAsh/15 rounded-xs relative overflow-hidden flex items-center">
                    <div
                      className="h-full bg-linear-to-r from-pastelMint via-buttercup to-coralBlush transition-all duration-100 ease-out rounded-xs"
                      style={{ width: `${vuLeft}%` }}
                    />
                  </div>
                </div>
                {/* VU Right */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono font-bold text-slateAsh/60">R</span>
                  <div className="w-9 h-2.5 bg-slateAsh/15 rounded-xs relative overflow-hidden flex items-center">
                    <div
                      className="h-full bg-linear-to-r from-pastelMint via-buttercup to-coralBlush transition-all duration-100 ease-out rounded-xs"
                      style={{ width: `${vuRight}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs scale-90 inline-block font-mono bg-cloudWhite px-1.5 py-0.5 rounded border border-slateAsh/15 text-slateAsh font-semibold">
                {formattedCounter}
              </span>
              <span className="text-xs font-bold text-coralBlush">NR 40</span>
            </div>
          </div>

          {/* Track title in handwritten aesthetic */}
          <div className="bg-buttercup/25 rounded-md px-3 py-1.5 mb-3 border border-buttercup/50 text-center">
            <h4 className="font-handwriting text-lg text-slateAsh font-bold truncate leading-tight">
              {currentTrack?.title || "Birthday Mixtape"}
            </h4>
            <p className="text-xs text-slateAsh/70 font-sans truncate">
              {currentTrack?.artist || "For Monmonkyu"}
            </p>
          </div>

          {/* Cassette Tape Spools Window with fixed reel anchoring */}
          <div className="relative bg-[#2A3442] rounded-lg px-6 py-2.5 h-16 grid grid-cols-[44px_1fr_44px] items-center border border-slateAsh/40 shadow-inner">
            {/* Magnetic tape bridge */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-4 bg-[#1E252E] rounded flex items-center justify-center overflow-hidden pointer-events-none">
              <div className="w-full h-1 bg-amber-900/60" />
            </div>

            {/* Left Reel (Fixed position) */}
            <div className="relative z-10 w-11 h-11 justify-self-center">
              <div
                className={`w-full h-full rounded-full bg-white border-2 border-slateAsh flex items-center justify-center shadow-md overflow-hidden ${isPlaying ? 'animate-spin' : ''
                  }`}
                style={{ animationDuration: '3s' }}
              >
                {/* Spool Cross Teeth */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="absolute w-full h-0.5 bg-slateAsh/30" />
                  <span className="absolute w-0.5 h-full bg-slateAsh/30" />
                  <span className="absolute w-full h-0.5 bg-slateAsh/30 rotate-45" />
                  <span className="absolute w-full h-0.5 bg-slateAsh/30 -rotate-45" />
                </div>
                <div className="relative z-10 w-5 h-5 rounded-full bg-slateAsh/25 flex items-center justify-center border border-slateAsh/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2A3442]" />
                </div>
              </div>
            </div>

            {/* Center viewing cutouts (Fixed width to avoid any spacing shift) */}
            <div className="z-10 justify-self-center flex items-center justify-center">
              <div className="w-20 text-center bg-[#1E252E] py-0.5 rounded border border-slateAsh/40 text-xs font-mono tracking-wider text-amber-200/80">
                {isPlaying ? 'PLAYING' : 'READY'}
              </div>
            </div>

            {/* Right Reel (Fixed position) */}
            <div className="relative z-10 w-11 h-11 justify-self-center">
              <div
                className={`w-full h-full rounded-full bg-white border-2 border-slateAsh flex items-center justify-center shadow-md overflow-hidden ${isPlaying ? 'animate-spin' : ''
                  }`}
                style={{ animationDuration: '3s' }}
              >
                {/* Spool Cross Teeth */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="absolute w-full h-0.5 bg-slateAsh/30" />
                  <span className="absolute w-0.5 h-full bg-slateAsh/30" />
                  <span className="absolute w-full h-0.5 bg-slateAsh/30 rotate-45" />
                  <span className="absolute w-full h-0.5 bg-slateAsh/30 -rotate-45" />
                </div>
                <div className="relative z-10 w-5 h-5 rounded-full bg-slateAsh/25 flex items-center justify-center border border-slateAsh/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2A3442]" />
                </div>
              </div>
            </div>
          </div>

          {/* Analog Tape Ruler Progress Bar & Draggable Playhead */}
          <div className="mt-3 pt-2.5 border-t border-dashed border-slateAsh/20">
            {/* Time labels & tape scale indicators */}
            <div className="flex items-center justify-between text-xs font-mono text-slateAsh/70 mb-1 select-none">
              <span className="font-semibold text-slateAsh tracking-tight tabular-nums">
                {formatTime(displayTime)}
              </span>
              <div className="flex items-center gap-1.5 opacity-40 text-[10px] font-mono tracking-widest uppercase">
                <span>0</span>
                <span>•</span>
                <span>50</span>
                <span>•</span>
                <span>100</span>
              </div>
              <span className="text-slateAsh/60 tracking-tight tabular-nums">
                {formatTime(effectiveDuration)}
              </span>
            </div>

            {/* Interactive Progress Track with Touch/Mouse Slider */}
            <div
              ref={trackRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              className="group/track relative h-6 flex items-center cursor-pointer touch-none select-none"
              role="slider"
              tabIndex={0}
              aria-label="Seek track position"
              aria-valuemin={0}
              aria-valuemax={Math.round(effectiveDuration)}
              aria-valuenow={Math.round(displayTime)}
              aria-valuetext={`${formatTime(displayTime)} of ${formatTime(effectiveDuration)}`}
              onKeyDown={handleKeyDown}
            >
              {/* Recessed Tape Groove Track */}
              <div className="relative w-full h-2 bg-cloudWhite rounded-full border border-slateAsh/25 shadow-inner overflow-hidden">
                {/* Vintage tape ruler graduated tick marks */}
                <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none opacity-25">
                  <span className="w-0.5 h-1 bg-slateAsh" />
                  <span className="w-0.5 h-1 bg-slateAsh" />
                  <span className="w-0.5 h-1 bg-slateAsh" />
                  <span className="w-0.5 h-1 bg-slateAsh" />
                  <span className="w-0.5 h-1 bg-slateAsh" />
                </div>

                {/* Progress Fill: Smooth gradient matching cassette VU meter */}
                <div
                  className="h-full bg-linear-to-r from-pastelMint via-buttercup to-coralBlush transition-[width] duration-75 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Draggable Playhead Thumb (Analog Tape Head Peg) with 44x44px touch hitbox */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slateAsh shadow-paper-sm flex items-center justify-center transition-transform duration-100 ${
                  isDragging
                    ? 'scale-125 shadow-paper ring-2 ring-skyMist'
                    : 'group-hover/track:scale-110 group-hover/track:shadow-paper'
                }`}
                style={{ left: `${progressPercent}%` }}
              >
                {/* 44x44px invisible touch hitbox for mobile fingertips */}
                <span className="absolute -inset-3.5 w-11 h-11 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-auto" aria-hidden="true" />
                {/* Center peg dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-slateAsh" />
              </div>

              {/* Floating Timestamp Tooltip on Hover or Drag */}
              {(isHovering || isDragging) && effectiveDuration > 0 && (
                <div
                  className="absolute -top-6 -translate-x-1/2 pointer-events-none z-30 px-1.5 py-0.5 rounded bg-slateAsh text-white text-[10px] font-mono font-semibold shadow-md whitespace-nowrap"
                  style={{ left: `${tooltipPercent}%` }}
                >
                  {formatTime(tooltipTime)}
                  {/* Tooltip bottom pointer arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1 border-t-2 border-t-slateAsh border-x-2 border-x-transparent border-b-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cassette Player Buttons & Controls */}
        <div className="mt-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 pt-1">
          {/* Track changer buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrev}
              title="Previous Track"
              aria-label="Previous track"
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10 flex items-center justify-center cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayToggle}
              title={isPlaying ? "Pause" : "Play"}
              aria-label={isPlaying ? "Pause track" : "Play track"}
              className={`px-4 py-2 min-h-[40px] rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-paper-sm active:scale-95 border border-slateAsh/15 cursor-pointer ${isPlaying
                ? 'bg-coralBlush text-slateAsh hover:brightness-105'
                : 'bg-pastelMint text-slateAsh hover:brightness-105'
                }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slateAsh" /> : <Play className="w-4 h-4 fill-slateAsh" />}
              <span className="text-xs font-sans">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handleNext}
              title="Next Track"
              aria-label="Next track"
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10 flex items-center justify-center cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control: full-width stacked on narrow mobile screens (<380px), inline on tablet/desktop */}
          <div className="w-full sm:w-auto flex items-center justify-end sm:justify-center gap-2.5 bg-white/85 px-3 py-1.5 rounded-lg border border-slateAsh/10 shadow-paper-sm min-h-[40px]">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                onVolumeChange(nextMute ? 0 : 0.7);
              }}
              className="text-slateAsh hover:text-slateAsh/80 transition-colors p-1"
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute volume" : "Mute volume"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              aria-label="Volume level"
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isMuted && val > 0) setIsMuted(false);
                onVolumeChange(val);
              }}
              className="w-24 sm:w-20 h-2 bg-slateAsh/20 rounded-lg appearance-none cursor-pointer accent-slateAsh"
            />
          </div>
        </div>

      </div>

      {/* Button below the cassette tape to download all music */}
      <div className="mt-4 flex flex-col items-center justify-center">
        <button
          onClick={handleDownloadZip}
          disabled={downloadStatus === 'loading'}
          title='Download all music in a zip file named "mon&#39;s bday playlist"'
          aria-label='Download all music in a zip file named "mon&#39;s bday playlist"'
          className={`group/dl relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-paper active:scale-95 border ${downloadStatus === 'success'
            ? 'bg-pastelMint text-slateAsh border-emerald-300'
            : downloadStatus === 'error'
              ? 'bg-coralBlush text-slateAsh border-red-300'
              : 'bg-white/95 hover:bg-white text-slateAsh border-slateAsh/15 hover:border-slateAsh/30 hover:shadow-paper-hover'
            }`}
        >
          {downloadStatus === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slateAsh/70" />
              <span>{downloadProgress || 'Zipping playlist...'}</span>
            </>
          ) : downloadStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span>Downloaded mon's bday playlist! 🎉</span>
            </>
          ) : downloadStatus === 'error' ? (
            <>
              <Download className="w-4 h-4 text-rose-600" />
              <span>{downloadProgress || 'Download failed • Retry'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slateAsh/70 group-hover/dl:translate-y-0.5 transition-transform" />
              <span>Download "mon's bday playlist" (.zip)</span>
            </>
          )}
        </button>

        <p className="mt-1.5 text-xs text-slateAsh/60 flex items-center gap-1.5 font-sans">
          <Music className="w-3 h-3 text-slateAsh/45 inline" />
          <span>All birthday tunes in one zip file</span>
        </p>
      </div>
    </div>
  );
}
