import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Sparkles, Image as ImageIcon, ZoomIn, FileText } from 'lucide-react';
import IconRenderer from './IconRenderer.jsx';

/**
 * Normalizes images specified in a letter:
 * - letter.images: array of strings or objects { url, caption, alt }
 * - letter.imageUrl / letter.image: string
 * - letter.scanUrl: handwritten letter image scan
 */
function getLetterImages(letter) {
  const images = [];

  // If scanUrl is provided and not already in images
  if (letter.scanUrl) {
    images.push({
      url: letter.scanUrl,
      caption: letter.scanCaption || "Handwritten letter scan",
      isScan: true,
    });
  }

  // If multiple images provided
  if (Array.isArray(letter.images)) {
    letter.images.forEach((img, idx) => {
      if (typeof img === 'string') {
        images.push({ url: img, caption: '', isScan: false });
      } else if (img && typeof img === 'object' && img.url) {
        images.push({
          url: img.url,
          caption: img.caption || '',
          alt: img.alt || `Photo attachment ${idx + 1}`,
          isScan: Boolean(img.isScan),
        });
      }
    });
  } else if (letter.imageUrl || letter.image) {
    const url = letter.imageUrl || letter.image;
    // Don't duplicate if it equals scanUrl
    if (url !== letter.scanUrl) {
      images.push({
        url,
        caption: letter.imageCaption || '',
        isScan: false,
      });
    }
  }

  return images;
}

export default function LetterModal({ letter, isOpen, onClose, celebrantName = "Monmonkyu" }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on mount
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
        return;
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
  }, [isOpen, onClose, selectedImage]);

  if (!isOpen || !letter) return null;

  const letterImages = getLetterImages(letter);
  const scanImages = letterImages.filter((img) => img.isScan);
  const attachedPhotos = letterImages.filter((img) => !img.isScan);
  const hasOnlyScans = scanImages.length > 0 && attachedPhotos.length === 0 && letter.type === 'handwritten';

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-dialog-title"
      >
        {/* Soft backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slateAsh/40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />

        {/* Letter Container */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-paper-elevated border-2 border-slateAsh/15 overflow-hidden my-8"
        >
          {/* Decorative Washi Tape on top */}
          <div className="washi-tape absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-6 bg-skyMist z-20 rounded-xs -rotate-1 border border-skyMist/80" />

          {/* Header Bar */}
          <div className="bg-skyMist/75 border-b-2 border-skyMist/90 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-paper-sm border border-slateAsh/10">
                <IconRenderer name={letter.sealIcon} className="w-5 h-5 text-slateAsh" fallback="heart" strokeWidth={2} />
              </div>
              <div>
                <h3 
                  id="letter-dialog-title"
                  className="font-bold text-slateAsh text-base sm:text-lg flex items-center gap-2"
                >
                  {letter.author}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 border border-slateAsh/15 text-slateAsh/80 font-normal">
                    {letter.relationship}
                  </span>
                  {letterImages.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/90 border border-slateAsh/15 text-slateAsh/70 font-mono">
                      <ImageIcon className="w-3 h-3" />
                      {letterImages.length} {letterImages.length === 1 ? 'image' : 'images'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slateAsh/60 flex items-center gap-1 font-sans">
                  <Calendar className="w-3 h-3" /> {letter.date}
                </p>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-slateAsh/70 hover:text-slateAsh transition-colors border border-transparent hover:border-slateAsh/15"
              aria-label="Close letter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Letter Content Body */}
          <div className="p-6 sm:p-10 lined-paper min-h-[350px] max-h-[75vh] overflow-y-auto space-y-6">
            
            {/* Handwritten Scan (if provided) */}
            {scanImages.length > 0 && (
              <div className="space-y-4">
                {scanImages.map((scan, idx) => (
                  <div key={idx} className="relative group">
                    <div className="washi-tape absolute -top-2 left-8 w-20 h-5 bg-buttercup/80 z-10 -rotate-2 rounded-xs border border-slateAsh/10" />
                    <div className="p-3 bg-white rounded-xl shadow-paper border border-slateAsh/15">
                      <div 
                        className="relative cursor-zoom-in overflow-hidden rounded-lg bg-cloudWhite"
                        onClick={() => setSelectedImage(scan)}
                      >
                        <img
                          src={scan.url}
                          alt={scan.caption || `Handwritten scan from ${letter.author}`}
                          className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-200 group-hover:scale-[1.01]"
                          onError={(e) => {
                            e.currentTarget.parentElement.innerHTML = `
                              <div class="p-8 text-center bg-skyMist/10 border border-dashed border-slateAsh/20 rounded-lg">
                                <p class="text-xs font-mono text-slateAsh/70">Handwritten scan (${scan.url})</p>
                                <p class="text-xs text-slateAsh/50 mt-1">Place your image file in public/photos/ or provide a valid URL.</p>
                              </div>
                            `;
                          }}
                        />
                        <div className="absolute bottom-2 right-2 bg-slateAsh/75 text-white p-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                      {scan.caption && (
                        <p className="font-handwriting text-base text-slateAsh/80 text-center mt-2">
                          {scan.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Letter Text (Typed or transcript of scan) */}
            {letter.content && (
              <div className={scanImages.length > 0 ? "pt-4 border-t border-dashed border-slateAsh/25" : ""}>
                {scanImages.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slateAsh/50 tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Transcript:</span>
                  </div>
                )}
                <div className={`${
                  scanImages.length > 0 
                    ? "font-sans text-slateAsh text-sm sm:text-base leading-relaxed" 
                    : "font-handwriting text-2xl sm:text-3xl text-slateAsh leading-relaxed"
                } whitespace-pre-line`}>
                  {letter.content}
                </div>
              </div>
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
                          onClick={() => setSelectedImage(photo)}
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

          {/* Footer note */}
          <div className="bg-[#FFFDF9] border-t border-slateAsh/10 px-6 py-3 flex items-center justify-between text-xs text-slateAsh/60">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-buttercup" />
              Written for {letter?.recipientNickname || celebrantName}
            </span>
            <button
              onClick={onClose}
              className="font-medium text-slateAsh hover:underline focus:ring-2 focus:ring-skyMist rounded px-1"
            >
              Close
            </button>
          </div>

        </motion.div>

        {/* Lightbox Modal for enlarged image preview */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-slateAsh/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-4xl max-h-[90vh] bg-white p-3 sm:p-4 rounded-xl shadow-2xl border-2 border-slateAsh/20 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slateAsh shadow-paper-sm z-10"
                aria-label="Close enlarged image"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedImage.url}
                alt={selectedImage.caption || "Enlarged view"}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded"
              />

              {selectedImage.caption && (
                <p className="font-handwriting text-lg text-slateAsh mt-2 text-center">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
