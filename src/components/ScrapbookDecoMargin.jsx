import React, { useState } from 'react';
import { Sparkles, Heart, Pin, Camera, Star, Music, Coffee, Compass, X } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';

/**
 * Pinned desktop side decoration item with support for custom photos or playful vintage ephemera.
 */
export default function ScrapbookDecoMargin({ side = "left", items = [] }) {
  const [activePhoto, setActivePhoto] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      <aside
        aria-label={`${side} decorative scrapbook margins`}
        className={`hidden xl:flex flex-col gap-8 2xl:gap-10 absolute top-28 ${
          side === 'left' ? 'left-3 2xl:left-6 3xl:left-12' : 'right-3 2xl:right-6 3xl:right-12'
        } w-44 2xl:w-52 3xl:w-60 pointer-events-auto select-none z-10`}
      >
        {items.map((item, idx) => {
          if (item.type === 'photo') {
            if (!item.imageUrl) return null;
            return (
              <div
                key={idx}
                className={`relative group bg-white p-2.5 pb-4 rounded-md shadow-paper border border-slateAsh/15 transition-all duration-300 hover:scale-105 hover:shadow-paper-hover cursor-pointer ${item.rotation || 'rotate-2'}`}
                style={{ transform: `rotate(${item.rotation || '0deg'})` }}
                onClick={() => item.imageUrl && setActivePhoto(item)}
                title={item.caption || "Click to zoom"}
              >
                {/* Washi tape on top */}
                <div
                  className={`washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-14 2xl:w-16 h-3.5 2xl:h-4 ${
                    item.tapeColor || 'bg-skyMist/85'
                  } z-10 rounded-xs border border-slateAsh/10`}
                />

                {/* Pushpin / Thumbtack dot */}
                <div className="absolute -top-1 left-2.5 w-2.5 h-2.5 rounded-full bg-coralBlush shadow-xs border border-white" />

                {/* Photo Area */}
                <div className="relative w-full aspect-square bg-skyMist/20 rounded overflow-hidden flex items-center justify-center border border-dashed border-slateAsh/20">
                  <img
                    src={item.imageUrl}
                    alt={item.caption || "Scrapbook photo"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Caption */}
                {item.caption && (
                  <p className="font-handwriting text-sm text-slateAsh text-center mt-2 leading-tight">
                    {item.caption}
                  </p>
                )}
              </div>
            );
          }

          if (item.type === 'ticket') {
            return (
              <div
                key={idx}
                className={`relative bg-cloudWhite p-3 rounded shadow-paper border border-dashed border-slateAsh/30 ${item.rotation || '-rotate-3'} transition-transform hover:rotate-0`}
              >
                {/* Vintage ticket notched edges */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#EBF7FD] border-r border-slateAsh/30" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#EBF7FD] border-l border-slateAsh/30" />

                <div className="flex items-center justify-between border-b border-dashed border-slateAsh/25 pb-1 mb-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slateAsh/60">
                    {item.category || "ADMIT ONE"}
                  </span>
                  <span className="text-[10px] font-mono text-slateAsh/70 font-bold">
                    {item.number || "№ 0918"}
                  </span>
                </div>
                <p className="font-handwriting text-base 2xl:text-lg text-slateAsh leading-tight">
                  {item.title}
                </p>
                <p className="text-xs font-sans text-slateAsh/70 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            );
          }

          if (item.type === 'sticker') {
            return (
              <div
                key={idx}
                className={`relative self-center p-3 rounded-2xl ${item.bgColor || 'bg-buttercup'} shadow-paper-sm border-2 border-dashed border-slateAsh/30 ${item.rotation || 'rotate-2'} transition-transform hover:scale-110`}
              >
                <div className="flex flex-col items-center justify-center text-center gap-1">
                  <IconRenderer name={item.icon || 'sparkles'} className="w-5 h-5 text-slateAsh" />
                  <span className="font-handwriting font-bold text-sm text-slateAsh uppercase tracking-wide">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] font-mono text-slateAsh/70">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          if (item.type === 'music-badge') {
            return (
              <div
                key={idx}
                className={`relative bg-white/95 p-3 rounded-xl shadow-paper border border-slateAsh/15 ${item.rotation || '-rotate-3'} transition-transform hover:scale-105`}
              >
                <div className="washi-tape absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-paleLilac/80 rounded-xs border border-slateAsh/10" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-7 h-7 rounded-full bg-[#2A3442] flex items-center justify-center text-amber-200">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-[10px] font-bold text-slateAsh truncate">
                      {item.track}
                    </p>
                    <p className="font-sans text-[10px] text-slateAsh/60 truncate">
                      {item.artist}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === 'stamp-cluster') {
            return (
              <div
                key={idx}
                className={`relative flex items-center justify-center p-2 ${item.rotation || 'rotate-6'}`}
              >
                <div className="relative w-24 2xl:w-28 h-28 2xl:h-32 bg-white rounded border border-dashed border-slateAsh/35 p-1.5 flex flex-col items-center justify-between shadow-paper-sm bg-[radial-gradient(#D4F1FF_1px,transparent_1px)] [background-size:8px_8px]">
                  <div className="w-full flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-bold text-slateAsh/60">AIR</span>
                    <span className="text-[10px] font-mono text-slateAsh/60">2026</span>
                  </div>
                  <div className="w-10 2xl:w-12 h-10 2xl:h-12 rounded-full bg-pastelMint/40 flex items-center justify-center border border-slateAsh/15">
                    <IconRenderer name={item.icon || "flower"} className="w-5 2xl:w-6 h-5 2xl:h-6 text-slateAsh/80" />
                  </div>
                  <span className="font-handwriting text-xs text-slateAsh font-bold tracking-wide">
                    {item.label || "Special Delivery"}
                  </span>
                </div>
                {/* Circular postmark stamp overlay */}
                <div className="absolute -bottom-2 -right-1 w-14 h-14 rounded-full border border-slateAsh/35 flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none opacity-60">
                  <span className="text-[10px] font-mono tracking-tighter text-slateAsh font-semibold">SEP 18</span>
                  <span className="text-[10px] font-mono tracking-tighter text-slateAsh">CELEBRATE</span>
                </div>
              </div>
            );
          }

          if (item.type === 'note') {
            return (
              <div
                key={idx}
                className={`relative bg-buttercup/40 p-3 rounded shadow-paper border border-buttercup/60 ${item.rotation || '-rotate-2'} transition-transform hover:scale-105`}
              >
                {/* Tape on corner */}
                <div className="washi-tape absolute -top-1.5 left-4 w-12 h-3.5 bg-white/80 rounded-xs -rotate-6 border border-slateAsh/10" />
                <div className="flex items-center gap-1.5 text-xs text-slateAsh/60 font-mono mb-1">
                  <Pin className="w-3 h-3 text-coralBlush" />
                  <span>memo</span>
                </div>
                <p className="font-handwriting text-base text-slateAsh leading-snug">
                  "{item.text}"
                </p>
                {item.author && (
                  <span className="block text-right font-handwriting text-xs text-slateAsh/70 mt-1">
                    — {item.author}
                  </span>
                )}
              </div>
            );
          }

          return null;
        })}
      </aside>

      {/* Lightbox for zooming margin photos */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-60 bg-slateAsh/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-lg bg-white p-3 rounded-lg shadow-2xl border border-slateAsh/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slateAsh shadow-paper-sm"
              aria-label="Close image"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.caption || "Scrapbook photo"}
              className="w-full h-auto rounded"
            />
            {activePhoto.caption && (
              <p className="font-handwriting text-base text-slateAsh mt-2 text-center">
                {activePhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
