import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';

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

  // Counter simulation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setLocalTime((prev) => (prev + 1) % 999);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formattedCounter = String(localTime).padStart(3, '0');

  return (
    <div id="mixtape-section" className="relative group w-full max-w-md mx-auto">
      {/* Decorative washi tape pinning cassette to board */}
      <div 
        className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-buttercup/80 z-20 rounded-sm -rotate-1 border border-amber-200/50"
      />

      {/* Cassette Shell */}
      <div className="relative bg-skyMist border-2 border-slateAsh/20 rounded-2xl p-5 shadow-paper transition-all duration-300 hover:shadow-paper-hover">
        {/* Screw holes in corners */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center text-[7px] text-slateAsh/50">✕</div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center text-[7px] text-slateAsh/50">✕</div>
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center text-[7px] text-slateAsh/50">✕</div>
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-slateAsh/40 bg-white/70 flex items-center justify-center text-[7px] text-slateAsh/50">✕</div>

        {/* Cassette Label Inset */}
        <div className="bg-white rounded-xl p-3.5 border border-slateAsh/15 shadow-inner-paper">
          
          {/* Header on label */}
          <div className="flex items-center justify-between border-b border-dashed border-slateAsh/20 pb-1.5 mb-2.5">
            <span className="text-[10px] font-bold tracking-widest text-slateAsh/70 uppercase">
              Side A • Hi-Fi Stereo
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono bg-cloudWhite px-1.5 py-0.5 rounded border border-slateAsh/15 text-slateAsh font-semibold">
                {formattedCounter}
              </span>
              <span className="text-[10px] font-bold text-coralBlush">NR 40</span>
            </div>
          </div>

          {/* Track title in handwritten aesthetic */}
          <div className="bg-buttercup/25 rounded-md px-3 py-1.5 mb-3 border border-buttercup/50 text-center">
            <h4 className="font-handwriting text-lg text-slateAsh font-bold truncate leading-tight">
              {currentTrack?.title || "Birthday Mixtape"}
            </h4>
            <p className="text-[11px] text-slateAsh/70 font-sans truncate">
              {currentTrack?.artist || "Friends & Memories"}
            </p>
          </div>

          {/* Cassette Tape Spools Window */}
          <div className="relative bg-[#2A3442] rounded-lg p-2.5 h-16 flex items-center justify-around border border-slateAsh/40 shadow-inner">
            {/* Magnetic tape bridge */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-4 bg-[#1E252E] rounded flex items-center justify-center overflow-hidden">
              <div className="w-full h-1 bg-amber-900/60" />
            </div>

            {/* Left Reel */}
            <div 
              className={`relative z-10 w-11 h-11 rounded-full bg-white border-2 border-slateAsh flex items-center justify-center shadow-md transition-transform duration-700 ease-linear ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-4 h-4 rounded-full bg-slateAsh/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2A3442]" />
              </div>
              {/* Spool Teeth */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-slateAsh/40" />
                <span className="w-0.5 h-full bg-slateAsh/40" />
              </div>
            </div>

            {/* Center viewing cutouts */}
            <div className="z-10 bg-[#1E252E] px-2 py-0.5 rounded border border-slateAsh/40 text-[9px] text-amber-200/80 font-mono tracking-wider">
              {isPlaying ? 'PLAYING' : 'READY'}
            </div>

            {/* Right Reel */}
            <div 
              className={`relative z-10 w-11 h-11 rounded-full bg-white border-2 border-slateAsh flex items-center justify-center shadow-md transition-transform duration-700 ease-linear ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-4 h-4 rounded-full bg-slateAsh/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#2A3442]" />
              </div>
              {/* Spool Teeth */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-slateAsh/40" />
                <span className="w-0.5 h-full bg-slateAsh/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Cassette Player Buttons */}
        <div className="mt-3.5 flex items-center justify-between gap-2 pt-1">
          {/* Track changer buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevTrack}
              title="Previous Track"
              className="p-2 rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              title={isPlaying ? "Pause" : "Play"}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-paper-sm active:scale-95 border border-slateAsh/15 ${
                isPlaying 
                  ? 'bg-coralBlush text-slateAsh hover:brightness-105' 
                  : 'bg-pastelMint text-slateAsh hover:brightness-105'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slateAsh" /> : <Play className="w-4 h-4 fill-slateAsh" />}
              <span className="text-xs">{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={onNextTrack}
              title="Next Track"
              className="p-2 rounded-lg bg-white/90 text-slateAsh hover:bg-white hover:text-slateAsh active:scale-95 transition-all shadow-paper-sm border border-slateAsh/10"
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
    </div>
  );
}
