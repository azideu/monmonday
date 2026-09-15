import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Sparkles, Image as ImageIcon, ZoomIn, ZoomOut, RotateCcw, Maximize2, FileText, PenTool, Volume2, VolumeX, Play, Pause, Music, ChevronLeft, ChevronRight } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';
import { playPaperRustle } from '../utils/soundEffects.js';

/**
 * Normalizes images specified in a letter:
 * - letter.images: array of strings or objects { url, caption, alt }
 * - letter.imageUrl / letter.image: string
 * - letter.scanUrl: handwritten letter image scan
 */
function getLetterImages(letter) {
  const images = [];
  const scanUrl = letter?.handwrittenImageUrl || letter?.scanUrl;

  // If handwritten image scan is provided and not already in images
  if (scanUrl) {
    images.push({
      url: scanUrl,
      caption: letter.scanCaption || "",
      isScan: true,
    });
  }

  // If multiple images provided
  if (Array.isArray(letter?.images)) {
    letter.images.forEach((img, idx) => {
      if (typeof img === 'string') {
        if (img !== scanUrl) {
          images.push({ url: img, caption: '', isScan: false });
        }
      } else if (img && typeof img === 'object' && img.url) {
        if (img.url !== scanUrl) {
          images.push({
            url: img.url,
            caption: img.caption || '',
            alt: img.alt || `Photo attachment ${idx + 1}`,
            isScan: Boolean(img.isScan),
          });
        }
      }
    });
  } else if (letter?.imageUrl || letter?.image) {
    const url = letter.imageUrl || letter.image;
    // Don't duplicate if it equals scanUrl
    if (url !== scanUrl) {
      images.push({
        url,
        caption: letter.imageCaption || '',
        isScan: false,
      });
    }
  }

  return images;
}

export default function LetterModal({ 
  letter, 
  isOpen, 
  onClose, 
  celebrantName = "Monmonkyu",
  isLetterAudioPlaying = false,
  onToggleLetterAudio = () => {},
  hasPrev = false,
  hasNext = false,
  onPrevLetter = () => {},
  onNextLetter = () => {},
  letterIndex = -1,
  totalLetters = 0,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [isFitMode, setIsFitMode] = useState(false);

  const handleOpenImage = (img) => {
    setSelectedImage(img);
    setZoomScale(1);
    setIsFitMode(false);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setZoomScale(1);
    setIsFitMode(false);
  };

  const handleZoomIn = (e) => {
    e?.stopPropagation?.();
    setIsFitMode(false);
    setZoomScale((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation?.();
    setIsFitMode(false);
    setZoomScale((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
  };

  const handleResetZoom = (e) => {
    e?.stopPropagation?.();
    setZoomScale(1);
    setIsFitMode(false);
  };

  const handleToggleFit = (e) => {
    e?.stopPropagation?.();
    setIsFitMode((prev) => !prev);
    setZoomScale(1);
  };

  const handleDoubleTap = (e) => {
    e?.stopPropagation?.();
    if (zoomScale > 1 || isFitMode) {
      setZoomScale(1);
      setIsFitMode(false);
    } else {
      setZoomScale(1.75);
      setIsFitMode(false);
    }
  };

  // Trap focus, play paper rustle, and handle Escape / Zoom keys
  useEffect(() => {
    if (!isOpen) return;

    // Play subtle stationery paper rustle
    playPaperRustle();

    // Focus close button on mount
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          handleCloseImage();
        } else {
          onClose();
        }
        return;
      }

      // Keyboard shortcuts when lightbox image viewer is active
      if (selectedImage) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          setIsFitMode(false);
          setZoomScale((prev) => Math.min(3, +(prev + 0.25).toFixed(2)));
          return;
        }
        if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          setIsFitMode(false);
          setZoomScale((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
          return;
        }
        if (e.key === '0') {
          e.preventDefault();
          setZoomScale(1);
          setIsFitMode(false);
          return;
        }
      }

      // Arrow key navigation between letters (when not inside an input/textarea and not viewing enlarged photo)
      if (!selectedImage && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        if (e.key === 'ArrowLeft' && hasPrev) {
          e.preventDefault();
          onPrevLetter();
          return;
        }
        if (e.key === 'ArrowRight' && hasNext) {
          e.preventDefault();
          onNextLetter();
          return;
        }
      }

      // Focus trap within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, selectedImage, hasPrev, hasNext, onPrevLetter, onNextLetter]);

  const letterImages = letter ? getLetterImages(letter) : [];
  const scanImages = letterImages.filter((img) => img.isScan);
  const attachedPhotos = letterImages.filter((img) => !img.isScan);
  const isHandwritten = letter?.type === 'handwritten' || scanImages.length > 0;

  return (
    <>
      <AnimatePresence>
      {isOpen && letter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-dialog-title"
        >
          {/* Hardware-accelerated soft backdrop without blur to prevent WebGL canvas composite flicker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slateAsh/50 will-change-[opacity]"
            aria-hidden="true"
          />

          {/* 3D Origami Unfolding Letter Container with isolated perspective */}
          <div className={`relative z-10 w-full max-w-2xl my-8 perspective-1000 flex justify-center transition-opacity duration-200 ${
            selectedImage ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.7, opacity: 0, y: 40, rotateX: -24, rotateY: 6 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                rotateX: 0, 
                rotateY: 0,
                transition: { 
                  type: 'spring', 
                  damping: 24, 
                  stiffness: 260, 
                  duration: 0.6 
                } 
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0, 
                y: 30, 
                rotateX: 16,
                transition: { duration: 0.2 } 
              }}
              className="relative w-full bg-[#FFFDF9] rounded-2xl shadow-paper-elevated border-2 border-slateAsh/15 overflow-hidden origin-top transform-style-3d will-change-transform"
            >
          {/* Subtle paper fold crease highlight overlay */}
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/[0.02] via-transparent to-black/[0.03] z-20" />
          {/* Decorative Washi Tape on top */}
          <div className="washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-6 bg-skyMist z-20 rounded-xs -rotate-1 border border-skyMist/80" />

          {/* Header Bar */}
          <div className="bg-skyMist/75 border-b-2 border-skyMist/90 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-paper-sm border border-slateAsh/10">
                <IconRenderer name={letter.sealIcon} className="w-4 h-4 sm:w-5 sm:h-5 text-slateAsh" fallback="heart" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 
                  id="letter-dialog-title"
                  className="font-bold text-slateAsh text-sm sm:text-lg flex flex-wrap items-center gap-1.5 sm:gap-2 leading-tight"
                >
                  <span className="truncate">{letter.author}</span>
                  <span className="text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-white/80 border border-slateAsh/15 text-slateAsh/80 font-normal">
                    {letter.relationship}
                  </span>
                  {isHandwritten ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/90 border border-slateAsh/15 text-slateAsh/80 font-mono">
                      <PenTool className="w-3 h-3 text-[#E56B6F]" />
                      <span>Handwritten</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/90 border border-slateAsh/15 text-slateAsh/70 font-mono">
                      <FileText className="w-3 h-3 text-slateAsh/60" />
                      <span>Typed</span>
                    </span>
                  )}
                  {attachedPhotos.length > 0 && (
                    <span 
                      className="inline-flex items-center gap-1 text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-white/90 border border-slateAsh/15 text-slateAsh/70 font-mono"
                      title={`${attachedPhotos.length} attached photo${attachedPhotos.length > 1 ? 's' : ''}`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      {attachedPhotos.length}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slateAsh/60 flex items-center gap-1 font-sans mt-0.5">
                  <Calendar className="w-3 h-3" /> {letter.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {(letter.audioUrl || letter.audio) && (
                <button
                  type="button"
                  onClick={onToggleLetterAudio}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-paper-sm border cursor-pointer ${
                    isLetterAudioPlaying
                      ? 'bg-pastelCoral/20 border-pastelCoral/50 text-slateAsh animate-pulse'
                      : 'bg-white/90 border-slateAsh/20 text-slateAsh/80 hover:bg-white'
                  }`}
                  aria-label={isLetterAudioPlaying ? "Pause voice note / audio" : "Play voice note / audio"}
                  title={letter.audioTitle || "Voice note / audio attached"}
                >
                  {isLetterAudioPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-slateAsh" />
                      <span className="hidden sm:inline">Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slateAsh text-slateAsh" />
                      <span className="hidden sm:inline">Play Audio</span>
                    </>
                  )}
                  <Volume2 className="w-3.5 h-3.5 opacity-75" />
                </button>
              )}

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 sm:p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white text-slateAsh/70 hover:text-slateAsh active:scale-95 transition-all border border-transparent hover:border-slateAsh/15 shrink-0 cursor-pointer"
                aria-label="Close letter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Letter Content Body */}
          <div className="p-6 sm:p-10 lined-paper min-h-[350px] max-h-[75vh] overflow-y-auto space-y-6">
            
            {/* If handwritten: display only the handwritten message scan image */}
            {isHandwritten ? (
              scanImages.length > 0 ? (
                <div className="space-y-6">
                  {scanImages.map((scan, idx) => (
                    <div key={idx} className="relative group max-w-xl mx-auto">
                      <div className="washi-tape absolute -top-2.5 left-10 w-24 h-6 bg-buttercup/90 z-20 -rotate-2 rounded-xs border border-slateAsh/10 shadow-2xs" />
                      <div className="p-3 sm:p-4 bg-[#FFFDF9] rounded-xl shadow-paper border border-slateAsh/15">
                        <div 
                          className="relative cursor-zoom-in overflow-hidden rounded-lg bg-cloudWhite flex items-center justify-center"
                          onClick={() => handleOpenImage(scan)}
                          title="Click to zoom in"
                        >
                          <img
                            src={scan.url}
                            alt={scan.caption || `Handwritten letter from ${letter.author}`}
                            className="w-full h-auto object-contain mx-auto rounded"
                            onError={(e) => {
                              e.currentTarget.parentElement.innerHTML = `
                                <div class="p-8 text-center bg-skyMist/10 border border-dashed border-slateAsh/20 rounded-lg w-full">
                                  <p class="text-xs font-mono text-slateAsh/70">Handwritten scan (${scan.url})</p>
                                  <p class="text-xs text-slateAsh/50 mt-1">Place your image file in public/photos/ or provide a valid URL.</p>
                                </div>
                              `;
                            }}
                          />
                          <div className="absolute bottom-3 right-3 bg-slateAsh/80 text-white px-2.5 py-1 rounded-full text-xs font-sans flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity shadow-paper-sm">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Tap to zoom</span>
                          </div>
                        </div>
                        {scan.caption && (
                          <p className="font-handwriting text-base text-slateAsh/80 text-center mt-3">
                            {scan.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback if marked handwritten but image scan URL is missing */
                <div className="p-8 text-center bg-white/80 rounded-xl border border-dashed border-slateAsh/25 max-w-md mx-auto">
                  <PenTool className="w-6 h-6 text-slateAsh/40 mx-auto mb-2" />
                  <p className="font-mono text-xs text-slateAsh/70">Handwritten letter scan pending</p>
                  <p className="text-xs text-slateAsh/50 mt-1">Add handwrittenImageUrl: "./photos/filename.png" to display the scan.</p>
                  {letter.content && (
                    <div className="mt-4 pt-4 border-t border-slateAsh/15 font-handwriting text-2xl text-slateAsh whitespace-pre-line text-left">
                      {letter.content}
                    </div>
                  )}
                </div>
              )
            ) : (
              /* If typed: display typed text directly onto the lined stationery */
              letter.content && (
                <div className="font-handwriting text-2xl sm:text-3xl text-slateAsh leading-relaxed whitespace-pre-line max-w-prose">
                  {letter.content}
                </div>
              )
            )}

            {/* Attached Memorabilia / Photos Grid */}
            {attachedPhotos.length > 0 && (
              <div className="pt-6 border-t border-dashed border-slateAsh/25 space-y-3">
                <span className="text-xs font-mono uppercase text-slateAsh/50 tracking-wider block">
                  Attached Photos & Doodles:
                </span>
                
                <div className={`grid gap-4 ${attachedPhotos.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {attachedPhotos.map((photo, pIdx) => {
                    const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];
                    const cardRotation = rotations[pIdx % rotations.length];

                    return (
                      <div 
                        key={pIdx}
                        className={`relative group bg-white p-3 rounded-lg shadow-paper border border-slateAsh/15 ${cardRotation} transition-transform hover:rotate-0 duration-200`}
                      >
                        {/* Washi tape pin */}
                        <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-pastelMint/80 z-10 rounded-xs border border-slateAsh/10" />
                        
                        <div 
                          className="relative cursor-zoom-in overflow-hidden rounded bg-cloudWhite aspect-4/3 flex items-center justify-center"
                          onClick={() => handleOpenImage(photo)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.alt || photo.caption || `Attachment from ${letter.author}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.parentElement.innerHTML = `
                                <div class="p-4 text-center bg-skyMist/15 text-slateAsh/70 w-full h-full flex flex-col items-center justify-center">
                                  <span class="text-xs font-mono">Attachment photo</span>
                                  <span class="text-[10px] text-slateAsh/50 mt-1">${photo.url}</span>
                                </div>
                              `;
                            }}
                          />
                          <div className="absolute bottom-2 right-2 bg-slateAsh/75 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {photo.caption && (
                          <p className="font-handwriting text-base text-slateAsh text-center mt-2 leading-tight">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Footer note & Sequential Letter Navigation */}
          <div className="bg-[#FFFDF9] border-t border-slateAsh/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slateAsh/70">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrevLetter}
                disabled={!hasPrev}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-sans font-medium transition-all ${
                  hasPrev
                    ? 'bg-white hover:bg-skyMist/40 border-slateAsh/20 text-slateAsh cursor-pointer shadow-paper-sm active:scale-95'
                    : 'opacity-35 border-slateAsh/10 text-slateAsh/40 cursor-not-allowed'
                }`}
                aria-label="Previous letter"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <span className="font-mono text-xs text-slateAsh/60 px-1">
                {letterIndex >= 0 ? `${letterIndex + 1} of ${totalLetters}` : ''}
              </span>

              <button
                type="button"
                onClick={onNextLetter}
                disabled={!hasNext}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-sans font-medium transition-all ${
                  hasNext
                    ? 'bg-white hover:bg-skyMist/40 border-slateAsh/20 text-slateAsh cursor-pointer shadow-paper-sm active:scale-95'
                    : 'opacity-35 border-slateAsh/10 text-slateAsh/40 cursor-not-allowed'
                }`}
                aria-label="Next letter"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-slateAsh/50 text-xs font-sans">
                Tip: Use ← → keys to flip letters
              </span>
              <button
                onClick={onClose}
                className="font-medium text-slateAsh hover:underline focus:ring-2 focus:ring-skyMist rounded px-2 py-1 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )}
</AnimatePresence>

{/* Lightbox Modal with True Interactive Zoom & Document Reading Portaled to document.body */}
{typeof document !== 'undefined' && createPortal(
  <AnimatePresence>
    {selectedImage && (
      <motion.div
        key="lightbox-zoom-portal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] isolate bg-slateAsh/90 backdrop-blur-md flex flex-col items-center justify-between select-none"
        onClick={handleCloseImage}
      >
        {/* Top Floating Control Ribbon */}
        <div 
          className="w-full pt-4 px-4 flex items-center justify-between max-w-4xl z-30 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title / Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-white/90 text-slateAsh text-xs font-mono font-medium px-3 py-1 rounded-full shadow-paper-sm border border-slateAsh/15 flex items-center gap-1.5">
              {selectedImage.isScan ? (
                <>
                  <PenTool className="w-3 h-3 text-[#E56B6F]" />
                  <span>Handwritten Letter</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3 h-3 text-slateAsh/70" />
                  <span>Photo View</span>
                </>
              )}
            </span>
          </div>

          {/* Interactive Zoom Toolbar */}
          <div className="bg-white/95 backdrop-blur-md text-slateAsh px-2 py-1 rounded-full shadow-paper-elevated border border-slateAsh/20 flex items-center gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.75}
              className="p-1.5 rounded-full hover:bg-slateAsh/10 text-slateAsh disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom Out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="font-mono text-xs font-bold text-slateAsh px-2 py-0.5 rounded hover:bg-slateAsh/10 min-w-[52px] text-center transition-colors cursor-pointer"
              title="Reset zoom to 100% (0)"
            >
              {Math.round(zoomScale * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 3.0}
              className="p-1.5 rounded-full hover:bg-slateAsh/10 text-slateAsh disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Zoom In (+)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slateAsh/20 mx-0.5" />

            <button
              type="button"
              onClick={handleToggleFit}
              className={`p-1.5 rounded-full hover:bg-slateAsh/10 text-slateAsh transition-colors cursor-pointer ${
                isFitMode ? 'bg-skyMist/60 text-slateAsh font-bold' : ''
              }`}
              title={isFitMode ? "Switch to Reading Width View" : "Fit Full Letter on Screen"}
              aria-label={isFitMode ? "Switch to Reading Width View" : "Fit Full Letter on Screen"}
            >
              {isFitMode ? <Maximize2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </button>

            <div className="w-px h-4 bg-slateAsh/20 mx-0.5" />

            <button
              type="button"
              onClick={handleCloseImage}
              className="p-1.5 rounded-full hover:bg-coralBlush/50 text-slateAsh hover:text-slateAsh transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close enlarged image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Viewport & Magnification Canvas */}
        <div 
          className="w-full h-full flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center cursor-default"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseImage();
            }
          }}
        >
          <div 
            className={`transition-all duration-200 ease-out my-auto ${
              isFitMode 
                ? 'max-h-[80vh] w-auto flex flex-col items-center justify-center'
                : selectedImage.isScan
                  ? 'w-full max-w-2xl sm:max-w-3xl my-6 flex flex-col items-center'
                  : 'w-auto max-w-4xl my-auto flex flex-col items-center justify-center'
            }`}
            style={{
              transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
              transformOrigin: 'top center',
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleTap}
          >
            {/* Paper Card Frame */}
            <div className={`relative bg-white rounded-xl shadow-paper-elevated border-2 border-white/80 p-2 sm:p-3 transition-shadow ${
              zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
            }`}>
              {/* Washi tape detail on scans */}
              {selectedImage.isScan && (
                <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-buttercup/90 z-20 -rotate-1 rounded-xs border border-slateAsh/15 shadow-xs" />
              )}

              <img
                src={selectedImage.url}
                alt={selectedImage.caption || (selectedImage.isScan ? `Handwritten letter from ${letter.author}` : "Enlarged photo")}
                className={`rounded block mx-auto ${
                  isFitMode 
                    ? 'max-h-[76vh] w-auto object-contain'
                    : selectedImage.isScan
                      ? 'w-full h-auto object-contain'
                      : 'max-h-[80vh] w-auto max-w-full object-contain'
                }`}
                draggable={false}
              />
            </div>

            {selectedImage.caption && (
              <p className="font-handwriting text-lg sm:text-xl text-white drop-shadow-md mt-3 text-center px-4 bg-slateAsh/60 py-1 rounded-full backdrop-blur-xs">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Helpful Navigation Tips */}
        <div className="pb-3 text-center pointer-events-none z-20">
          <span className="text-xs font-mono text-white/70 bg-slateAsh/70 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10 shadow-xs">
            Scroll mousewheel to read • Double-click to {zoomScale > 1 ? 'reset' : 'zoom in'} • Esc to close
          </span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.body
)}
</>
);
}
