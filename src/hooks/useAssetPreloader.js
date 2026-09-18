import { useState, useEffect, useRef } from 'react';

/**
 * useAssetPreloader
 * Preloads critical images and waits for web fonts to be ready.
 * Provides a smoothed progress percentage, warm scrapbook status text,
 * and enforces both a minimum display time (to avoid visual flash)
 * and a fail-safe maximum timeout (to prevent slow networks from blocking the user).
 */
export function useAssetPreloader(imageUrls = [], options = {}) {
  const { minDuration = 1200, maxDuration = 3500 } = options;

  const [rawProgress, setRawProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [statusText, setStatusText] = useState("Gathering cherished memories...");

  const isMountedRef = useRef(true);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    isMountedRef.current = true;
    startTimeRef.current = Date.now();

    const uniqueUrls = Array.from(
      new Set(imageUrls.filter((url) => typeof url === 'string' && url.trim().length > 0))
    );

    // Total units: unique images + 1 for fonts
    const totalUnits = uniqueUrls.length + 1;
    let completedUnits = 0;

    const updateUnit = () => {
      if (!isMountedRef.current) return;
      completedUnits += 1;
      const pct = Math.min(100, Math.round((completedUnits / totalUnits) * 100));
      setRawProgress(pct);

      if (pct >= 100) {
        checkReadiness();
      }
    };

    const checkReadiness = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (isMountedRef.current) {
          setRawProgress(100);
          setDisplayProgress(100);
          setIsReady(true);
        }
      }, remainingTime);
    };

    // 1. Font readiness check
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => updateUnit())
        .catch(() => updateUnit());
    } else {
      updateUnit();
    }

    // 2. Image preloading
    if (uniqueUrls.length === 0) {
      // If no images provided, ready right after font check
      updateUnit();
    } else {
      uniqueUrls.forEach((src) => {
        const img = new Image();
        img.onload = updateUnit;
        img.onerror = updateUnit; // Fail gracefully without locking
        img.src = src;
      });
    }

    // 3. Fail-safe maximum timeout
    const timeoutTimer = setTimeout(() => {
      if (isMountedRef.current && !isReady) {
        setRawProgress(100);
        setDisplayProgress(100);
        setIsReady(true);
      }
    }, maxDuration);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Smooth lerping of displayProgress toward rawProgress
  useEffect(() => {
    const step = () => {
      setDisplayProgress((prev) => {
        if (prev >= rawProgress) return prev;
        const diff = rawProgress - prev;
        // Ease towards rawProgress
        const increment = Math.max(1, Math.ceil(diff * 0.18));
        return Math.min(rawProgress, prev + increment);
      });
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [rawProgress]);

  // Update status narrative based on progress
  useEffect(() => {
    if (isReady || displayProgress >= 100) {
      setStatusText("Ready for Monmonkyu! ✨");
    } else if (displayProgress < 28) {
      setStatusText("Gathering cherished memories...");
    } else if (displayProgress < 60) {
      setStatusText("Pinning polaroids with washi tape...");
    } else if (displayProgress < 88) {
      setStatusText("Tuning the mixtape cassette...");
    } else {
      setStatusText("Sealing with love...");
    }
  }, [displayProgress, isReady]);

  return {
    progress: displayProgress,
    isReady,
    statusText,
  };
}
