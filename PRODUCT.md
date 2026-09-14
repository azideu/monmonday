# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Primary recipient: Monmonkyu (celebrating birthday on September 18).
- Contributing creators: Close friends and loved ones (Akari, Alin, Fiyoll, Kai, Kiwan, Kucing Kelabu, Marci, Meguri, Opanchu, Zai) contributing letters, memories, photos, and music.

## Product Purpose
A personal digital scrapbook and interactive birthday keepsake created to celebrate Monmonkyu. It brings together heartfelt letters, nostalgic photos, a curated playlist, and tactile celebratory moments into an intimate, enduring web experience.

## Positioning
An intimate, bespoke digital gift characterized by tactile physical-scrapbook metaphors—spinning cassette reels with ambient music, flipping polaroids with handwritten back-notes, wax-sealed stationery envelopes, and an interactive birthday cake candle to blow out with confetti—creating an emotional and memorable experience rather than a generic card or static webpage.

## Operating Context
- Accessed on personal desktop and mobile browsers by Monmonkyu and close loved ones.
- Browsed leisurely in a relaxed, reflective setting (playing background music while reading personal notes and looking through photo memories).

## Capabilities and Constraints
- Background audio player styled as a vintage cassette player with spinning reels and fallback Web Audio synthesis.
- Polaroid photo gallery with realistic tape aesthetics and 3D card flips revealing handwritten notes on the back.
- Interactive wax-sealed envelopes that open into a lined stationery letter reader.
- Interactive birthday cake with an animated candle flame that can be clicked to "blow out", triggering celebratory confetti in palette colors.
- Built with React, Vite, Tailwind CSS, and Framer Motion. Content cleanly separated in `src/data/content.js`.

## Brand Commitments
- Name: Monmonkyu: Birthday Scrapbook.
- Voice & Tone: Warm, cozy, personal, nostalgic, and affectionate.
- Metaphor: Tactile physical stationery, vintage cassette tapes, wax seals, and taped polaroids.

## Evidence on Hand
- Source codebase: React + Tailwind CSS in `src/`.
- Curated playlist, letters, and polaroid memories in `src/data/content.js`.
- Color specifications in `colors.md` and `README.md`.
- All content represents genuine personal messages and memories; future work must not fabricate commercial metrics or generic testimonials.

## Product Principles
- **Tactile Nostalgia Over Flat Digital**: Use physical-world interactions (flipping cards, opening letters, spinning cassette reels) to create a warm, tangible connection.
- **Intimacy First**: Design for a deeply personal, one-to-one feeling rather than a loud public social media hub.
- **Thoughtful Pace**: Encourage calm exploration—reading letters and listening to music without rush or clutter.
- **Graceful Fallbacks**: Audio playback gracefully falls back to Web Audio synthesis if external audio files fail to load.
