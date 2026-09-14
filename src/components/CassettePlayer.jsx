import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Activity, Download, Check, Loader2, Music } from 'lucide-react';
import JSZip from 'jszip';
import { playDeckClick } from '../utils/soundEffects.js';

export default function CassettePlayer({
  playlist = [],
  currentTrackIndex = 0,
  isPlaying = false,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  volume = 0.7,
  onVolumeChange
}) {
  const currentTrack = playlist[currentTrackIndex] || playlist[0];
  const [isMuted, setIsMuted] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [vuLeft, setVuLeft] = useState(15);
  const [vuRight, setVuRight] = useState(20);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [downloadProgress, setDownloadProgress] = useState('');

  // Counter simulation & Audio-reactive VU meter animation
  useEffect(() => {
    let interval;
    let vuInterval;

    if (isPlaying) {
      interval = setInterval(() => {
        setLocalTime((prev) => (prev + 1) % 999);
      }, 1000);

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
      clearInterval(interval);
      clearInterval(vuInterval);
    };
  }, [isPlaying, volume]);

  const formattedCounter = String(localTime).padStart(3, '0');

  const handlePlayToggle = () => {
    playDeckClick();
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

      // Prepare track list to download
      const tracksToZip = [];

      if (Array.isArray(playlist) && playlist.length > 0) {
        playlist.forEach((track, index) => {
          const num = String(index + 1).padStart(2, '0');
          const safeTitle = (track.title || `Track ${index + 1}`).replace(/[/\\?%*:|"<>]/g, '-');
          const safeArtist = (track.artist || 'Artist').replace(/[/\\?%*:|"<>]/g, '-');
          tracksToZip.push({
            filename: `${num} - ${safeArtist} - ${safeTitle}.mp3`,
            url: track.audioUrl,
            title: track.title,
            artist: track.artist,
          });
        });
      }

      // Also include bonus guitar track (take 2) if present in /music/
      const bonusUrl = './music/akaribdayguitar2.mp3';
      tracksToZip.push({
        filename: `${String(tracksToZip.length + 1).padStart(2, '0')} - akari - Happy Birthday! (Guitar Acoustic - Take 2).mp3`,
        url: bonusUrl,
        title: 'Happy Birthday! (Guitar Acoustic - Take 2)',
        artist: 'akari',
        isBonus: true,
      });

      let fetchedSuccess = 0;
      for (let i = 0; i < tracksToZip.length; i++) {
        const item = tracksToZip[i];
        setDownloadProgress(`Zipping track ${i + 1}/${tracksToZip.length}...`);
        try {
          const res = await fetch(resolveUrl(item.url));
          if (res.ok) {
            const blob = await res.blob();
            zip.file(item.filename, blob);
            fetchedSuccess++;
          } else if (!item.isBonus) {
            console.warn(`Could not load audio track: ${item.url}`);
          }
        } catch (err) {
          if (!item.isBonus) {
            console.warn(`Error fetching ${item.filename}:`, err);
          }
        }
      }

      if (fetchedSuccess === 0) {
        throw new Error('No audio tracks could be retrieved.');
      }

      // Add a sweet tracklist / birthday message note
      const tracklistNote = [
        "=========================================",
        "   MON'S BDAY PLAYLIST - ACOUSTIC TAPES  ",
        "=========================================",
        "",
        "Happy 22nd Birthday, Mon! 🎂✨",
        "From all your favorite people and furry friends.",
        "",
        "TRACKLIST:",
        ...tracksToZip.slice(0, fetchedSuccess).map((t, idx) => `  ${String(idx + 1).padStart(2, '0')}. ${t.artist} - ${t.title}`),
        "",
        "Enjoy the tunes and have the wonderful birthday you deserve! 💖"
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
        </div>

        {/* Cassette Player Buttons */}
        <div className="mt-3.5 flex items-center justify-between gap-2 pt-1">
          {/* Track changer buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              title="Previous Track"
              className="p-2 rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10 cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayToggle}
              title={isPlaying ? "Pause" : "Play"}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-paper-sm active:scale-95 border border-slateAsh/15 cursor-pointer ${isPlaying
                ? 'bg-coralBlush text-slateAsh hover:brightness-105'
                : 'bg-pastelMint text-slateAsh hover:brightness-105'
                }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slateAsh" /> : <Play className="w-4 h-4 fill-slateAsh" />}
              <span className="text-xs">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handleNext}
              title="Next Track"
              className="p-2 rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10 cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-white/80 px-2.5 py-1.5 rounded-lg border border-slateAsh/10">
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                onVolumeChange(nextMute ? 0 : 0.7);
              }}
              className="text-slateAsh hover:text-slateAsh/80 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isMuted && val > 0) setIsMuted(false);
                onVolumeChange(val);
              }}
              className="w-16 h-1.5 bg-slateAsh/20 rounded-lg appearance-none cursor-pointer accent-slateAsh"
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

        <p className="mt-1.5 text-[11px] text-slateAsh/60 flex items-center gap-1.5 font-sans">
          <Music className="w-3 h-3 text-slateAsh/45 inline" />
          <span>All birthday tunes in one zip file</span>
        </p>
      </div>
    </div>
  );
}
