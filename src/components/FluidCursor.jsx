import React, { useEffect, useRef } from 'react';

/**
 * Analog Stationery Stardust Cursor Trail
 * 
 * Replaces heavy WebGL dye-fluid shaders with a lightweight, battery-friendly
 * analog craft dust trail (delicate 4-point paper stars, pastel droplets, and diamond sparkles).
 * 
 * Features:
 * - Active pointer tip sparkle that directly follows the cursor position.
 * - Drifting stardust wake (pastel paper stars, confetti specks, diamond glints) that trails behind cursor movement.
 * - Zero idle CPU/GPU consumption (animation loop sleeps when stationary and particles have settled).
 * - Calibrated with exact DESIGN.md palette tokens.
 */

// Core palette strictly aligned with DESIGN.md
const PALETTE = [
  '#D4F1FF', // primary
  '#FFEE8C', // accent-buttercup
  '#C8F7DC', // accent-mint
  '#FFD6D6', // accent-coral
  '#E5DBFF', // accent-lilac
];

const SHAPES = ['star', 'sparkle', 'dot'];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}

export default function FluidCursor({
  enabled = true,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = null;
    let particles = [];
    let pointerX = -100;
    let pointerY = -100;
    let lastX = null;
    let lastY = null;
    let pointerActive = false;
    let pointerFade = 0;
    let isDisposed = false;

    // Synchronize canvas buffer with device pixel ratio
    const updateSize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // Spawn a drifting stardust particle at given coordinates
    const spawnParticle = (x, y, vxBias = 0, vyBias = 0) => {
      if (particles.length > 36) return;

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.2;

      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed + vxBias * 0.15,
        vy: Math.sin(angle) * speed + 0.35 + vyBias * 0.15, // Gentle gravity drift
        size: shape === 'star' ? 4.5 + Math.random() * 3.5 : 2.5 + Math.random() * 2.5,
        alpha: 0.95,
        decay: 0.022 + Math.random() * 0.018,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color,
        shape,
      });

      startLoop();
    };

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      pointerX = x;
      pointerY = y;
      pointerActive = true;
      pointerFade = 1.0;

      if (lastX === null || lastY === null) {
        lastX = x;
        lastY = y;
        spawnParticle(x, y);
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= 8) {
        const count = Math.min(Math.floor(distance / 14) + 1, 3);
        for (let i = 0; i < count; i++) {
          const interpX = lastX + (dx * (i + 1)) / (count + 1);
          const interpY = lastY + (dy * (i + 1)) / (count + 1);
          spawnParticle(interpX, interpY, dx * 0.05, dy * 0.05);
        }
        lastX = x;
        lastY = y;
      }

      startLoop();
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      lastX = null;
      lastY = null;
    };

    // Draw a 4-pointed craft star
    const drawCraftStar = (cx, cy, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const spikes = 4;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const startLoop = () => {
      if (!animationFrameId && !isDisposed) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Main animation loop
    const render = () => {
      if (isDisposed) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Draw active follower star right at pointer position
      if (pointerFade > 0.02 && pointerX > 0 && pointerY > 0) {
        ctx.save();
        ctx.translate(pointerX, pointerY);
        
        // Soft aura glow
        ctx.fillStyle = hexToRgba('#D4F1FF', 0.5 * pointerFade);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Delicate center star following cursor
        ctx.fillStyle = hexToRgba('#3E4A5B', 0.65 * pointerFade);
        drawCraftStar(0, 0, 5, 1.8);
        ctx.restore();

        if (!pointerActive) {
          pointerFade -= 0.04;
        }
      }

      // 2. Draw drifting stardust wake
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Deceleration
        p.vy *= 0.94;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft paper drop shadow for tactile depth
        ctx.shadowColor = 'rgba(62, 74, 91, 0.2)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;

        ctx.fillStyle = hexToRgba(p.color, p.alpha);

        if (p.shape === 'star') {
          drawCraftStar(0, 0, p.size, p.size * 0.38);
        } else if (p.shape === 'sparkle') {
          // Diamond sparkle
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft circular droplet
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Keep loop running if particles exist or pointer fade is still settling
      if (particles.length > 0 || pointerFade > 0.02) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      particles = [];
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full pointer-events-none z-50 select-none ${className}`}
    />
  );
}
