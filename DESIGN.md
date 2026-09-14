---
name: Monmonkyu Birthday Scrapbook
description: A tactile, pastel-hued digital scrapbook celebrating birthday memories with nostalgic physical metaphors.
colors:
  primary: "#D4F1FF"
  accent-buttercup: "#FFEE8C"
  accent-mint: "#C8F7DC"
  accent-coral: "#FFD6D6"
  accent-lilac: "#E5DBFF"
  neutral-bg: "#F8FBFE"
  neutral-desk: "#EBF7FD"
  neutral-paper: "#FFFFFF"
  neutral-stationery: "#FFFDF9"
  neutral-text: "#3E4A5B"
  neutral-muted: "#6B7A90"
typography:
  display:
    fontFamily: "Caveat, Patrick Hand, cursive"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Playfair Display, serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-buttercup}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  card-polaroid:
    backgroundColor: "{colors.neutral-paper}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "14px 14px 20px 14px"
  card-envelope:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Monmonkyu Birthday Scrapbook

## Overview

**Creative North Star: "The Nostalgic Desk Scrapbook"**

The design language creates the feeling of gathering around a sunlit craft desk strewn with cherished keepsakes: taped polaroid photos, handwritten letters sealed with warm wax, a vintage pastel cassette player softly playing acoustic melodies, and a birthday cake ready for a wish. The atmosphere is playful, cheerful, and whimsical—a lighthearted DIY memory journal balancing nostalgic analog warmth with seamless digital interactions.

Rather than relying on flat digital cards or noisy party animations, every element simulates physical stationery resting in space. Surfaces carry delicate paper drop shadows, washi tape strips have translucent fiber textures with jagged cut ends, and cards rotate at subtle, natural angles as if placed down by hand. Micro-interactions reward curiosity through tactile physics: polaroids flip in 3D to reveal notes on their backs, envelopes break their wax seals into stationery sheets, and blowing out the candle sends a burst of pastel confetti across the desk.

**Key Characteristics:**
- **Handcrafted Stationery Metaphors**: Realistic washi tape strips, wax stamps, lined letter sheets, and vintage postal marks anchor the digital medium in physical craft.
- **Airy Pastel Palette**: Calming Sky Mist blue base layered with Buttercup Glow, Pastel Mint, Soft Coral, and Pale Lilac accents, grounded by deep Slate Ash ink text.
- **Dual Typographic Soul**: Clean, friendly Nunito for intuitive system UI paired with expressive handwritten cursive (Caveat, Patrick Hand) for heartfelt personal notes.
- **Gentle Paper Physics**: Soft layered elevation, subtle rotational tilts (-2° to +2°), and 3D card flips that mimic handling real paper keepsakes.

## Colors

The palette evokes an airy, sunlit memory journal: a gentle sky-blue desk surface hosting soft candy pastels and natural stationery whites, anchored by dark slate ink.

### Primary
- **Sky Mist** (#D4F1FF): The primary base of the entire experience. Used for the page background tone, main UI button surfaces, washi tape strips, cassette player body, and active navigation highlights.

### Secondary
- **Buttercup Glow** (#FFEE8C): Cheerful, warm candlelight accent. Used for the glowing candle flame, cassette tape labels, high-priority highlights, and active celebratory badges.
- **Pastel Mint** (#C8F7DC): Fresh botanical accent. Used for postage cancellation stamps, secondary washi tape strips, and celebratory confetti particles.

### Tertiary
- **Soft Coral Blush** (#FFD6D6): Warm romantic accent. Used for tactile wax seals, birthday cake strawberry icing, heart icons, and warm letter envelopes.
- **Pale Lilac** (#E5DBFF): Dreamy lavender accent. Used for decorative badges, commemorative stamps, and special letter envelopes.

### Neutral
- **Cloud White** (#F8FBFE): Pure cardstock white. Used for polaroid borders, envelope cards, letter modals, and cassette label insets.
- **Lined Stationery Cream** (#FFFDF9): Warm off-white lined paper background used for reading letter contents.
- **Desk Surface Mist** (#EBF7FD): The ambient background canvas tone of the scrapbook desk.
- **Slate Ash** (#3E4A5B): Primary ink color for all headings, body copy, icons, and borders. Provides high-contrast legibility while remaining softer than harsh pure black.
- **Muted Slate Ink** (#6B7A90): Secondary ink for dates, locations, meta tags, and subtle dividers.

### Named Rules
**The Soft Ink Rule.** Never use pure black (#000000) for text or borders. All typography, icons, and line art must render in Slate Ash (#3E4A5B) or Muted Slate Ink (#6B7A90) to preserve the gentle stationery feel.
**The Pastel Balance Rule.** Sky Mist dominates the canvas (>= 70% of colored surfaces); warm coral, buttercup, and mint accents appear strictly as focused focal points (<= 15% combined).

## Typography

**Display Font:** Caveat (with Patrick Hand, cursive fallback)
**Headline Font:** Playfair Display (with serif fallback)
**Body & UI Font:** Nunito (with system-ui, sans-serif fallback)

**Character:** A delightful dialogue between clean, readable modern UI and warm, intimate handwriting. Nunito provides accessible, friendly clarity for navigation and controls, while Caveat injects authentic diary warmth into personal notes, captions, and sign-offs.

### Hierarchy
- **Display** (Bold 700, clamp(2rem, 5vw, 3.5rem), line-height 1.1): Used for celebratory hero titles, personal names, and primary handwritten section callouts.
- **Headline** (Semi-bold 600, clamp(1.5rem, 3.5vw, 2.25rem), line-height 1.2): Used for section titles ("Polaroid Memories", "Letters & Wishes", "Birthday Mixtape").
- **Title** (Bold 700, 1.25rem / 20px, line-height 1.3): Used for letter authors, song titles, and modal headers.
- **Body** (Regular 400, 1rem / 16px, line-height 1.6, max line-length 65ch): Used for letter content, memory descriptions, and instructional hints.
- **Label** (Bold 700, 0.75rem / 12px, line-height 1.4, letter-spacing 0.08em, uppercase): Used for cassette tape markings (SIDE A, NR 40), airmail postal badges, and navigation tags.

### Named Rules
**The Handwritten Authenticity Rule.** Cursive fonts (Caveat, Patrick Hand) are reserved exclusively for human personal expression: back-of-photo notes, letter bodies, celebrant names, and handwritten doodle labels. System controls and metadata must remain in Nunito.

## Layout

The page is structured as a physical scrapbook board centered on the screen (max-width 1024px / 64rem), set against a subtle patterned grid canvas with dot grain.

Items are arranged organically rather than in rigid data tables:
- **Staggered Scrapbook Grid**: Polaroids and envelopes sit in responsive CSS grids (1 col mobile, 2 col tablet, 3 col desktop) with staggered vertical offsets and organic rotational tilts (-2° to +2°).
- **Sticky Ribbon Navigation**: A pill-shaped translucent ribbon pinned at the top with a washi tape accent, providing smooth jump navigation to Photos, Letters, Mixtape, and Cake.
- **Generous Breathing Room**: Vertical rhythm uses 48px to 64px section spacing to let each keepsake stand out without visual crowding.

## Elevation & Depth

Depth is conveyed through tactile paper layering rather than heavy software drop-shadows or neon glows. Shadows use Slate Ash tinted with low alpha values to simulate natural desk light filtering through textured paper.

### Shadow Vocabulary
- **Paper Small** (`box-shadow: 0 2px 4px rgba(62, 74, 91, 0.05), 0 1px 2px rgba(62, 74, 91, 0.04)`): Rest state for small buttons, badges, and wax seals.
- **Paper Default** (`box-shadow: 0 8px 20px -4px rgba(62, 74, 91, 0.08), 0 4px 8px -2px rgba(62, 74, 91, 0.04)`): Default resting elevation for polaroids, envelopes, and cassette player shell.
- **Paper Hover** (`box-shadow: 0 16px 32px -6px rgba(62, 74, 91, 0.12), 0 8px 16px -4px rgba(62, 74, 91, 0.06)`): Hover state when a user hovers over an interactive card, paired with a slight lift (`transform: translateY(-4px) scale(1.02)`).
- **Paper Elevated** (`box-shadow: 0 24px 48px -12px rgba(62, 74, 91, 0.16), 0 12px 24px -6px rgba(62, 74, 91, 0.08)`): Active modal dialogues and expanded letters.
- **Washi Tape Shadow** (`box-shadow: 0 1px 3px rgba(62, 74, 91, 0.08)`): Flat translucent tape strips adhering items to the desk.
- **Inner Paper Inset** (`box-shadow: inset 0 2px 6px rgba(62, 74, 91, 0.03)`): Recessed label insets on the cassette body.

### Named Rules
**The Physical Lift Rule.** Hovering an interactive element lifts it physically upward (2px to 4px) and deepens its paper drop-shadow. No harsh outline rings or color flashes.

## Shapes

- **Polaroid Frames**: Rectangular cards with 8px radius, thick bottom border chin, containing a square image viewport with dashed placeholder borders.
- **Washi Tape Strips**: Translucent tape bars (opacity 0.75–0.9) with 2px corner radius, rotated at gentle angles (-3° to +3°), featuring serrated jagged edges created via repeating micro-gradients.
- **Wax Seals**: Circular medallion badges (32px to 40px) with double-ring embossed rims and central stamp icons (flowers, leaves, hearts).
- **Stationery Envelopes**: Folded paper geometry crafted with triangular clip-path flaps (`polygon(0 0, 100% 0, 50% 100%)`).
- **Interactive Buttons**: Pill and soft-rectangle shapes (8px to 16px radius) with comfortable 44px minimum touch targets.

## Components

### Buttons
- **Shape**: Rounded pill or rounded rectangle (8px to 12px radius).
- **Primary**: Sky Mist background (#D4F1FF), Slate Ash text (#3E4A5B), subtle border (#D4F1FF/90), padding 8px 16px.
- **Hover / Focus**: Transitions to Buttercup Glow (#FFEE8C) or lifts 2px with enhanced paper shadow; keyboard focus shows a clear 2px Sky Mist outline ring.
- **Ghost / Nav Item**: Transparent background, padding 6px 10px, hover fill of Sky Mist at 60% opacity.

### Navigation Ribbon
- **Structure**: Centered floating bar, `bg-white/95`, `backdrop-blur-md`, 16px border-radius, 2px border in Sky Mist, pinned with a miniature washi tape sticker.
- **Contents**: Celebrant name badge, section navigation bookmark tabs, and quick music play/pause toggle with animated equalizer bars.

### Polaroid Card
- **Structure**: 256px–288px width, 340px–360px height, 8px radius, white cardstock border, pinned by a washi tape strip at the top.
- **Front View**: Square photo frame with handwritten caption, location pin, and date stamp.
- **Back View**: 3D flip rotation (rotateY 180deg) revealing lined stationery with a heartfelt personal note and doodle stamp.
- **Interaction**: Smooth 700ms 3D flip on click or Enter key.

### Letter Envelope & Reader
- **Structure**: 288px–320px width, 208px height, pastel colored envelope shell (Sky Mist, Buttercup, Soft Coral, or Pale Lilac), corner washi tape, and wax seal.
- **Letter Modal**: Opens an expanded lined stationery sheet (`.lined-paper`, repeating blue ruled lines at 32px line-height) with postal cancellation marks and date stamp.

### Signature Component: Cassette Player
- **Structure**: Vintage cassette shell in Sky Mist with corner screw indentations, white cassette label sticker, mechanical 3-digit counter, and dual spinning magnetic tape reels that rotate continuously during audio playback.
- **Controls**: Play/Pause, Next Track, Previous Track, Volume slider, and mute toggle.

### Signature Component: Birthday Cake & Candle
- **Structure**: Multi-layer tiered pastel cake with soft coral icing and an interactive flickering candle flame.
- **Interaction**: Clicking the candle blows out the flame with rising smoke particles and triggers a 3-stage pastel confetti cannon burst across the screen.

## Do's and Don'ts

### Do:
- **Do** anchor new screens and features in physical stationery and desk craft metaphors (washi tape, stamps, paper folds).
- **Do** use Slate Ash (#3E4A5B) for all typography and UI iconography to maintain gentle, readable contrast.
- **Do** give cards and photo artifacts slight, organic rotational tilts (-2° to +2°) to create the authentic feel of hand-placed scrapbook elements.
- **Do** preserve 3D perspective and tactile paper elevation transitions on interactive elements.
- **Do** provide smooth fallbacks (e.g. synthesized audio chimes) for sensory interactive features.

### Don'ts:
- **Don't** use pure black (#000000) or harsh pure white backgrounds; use Cloud White (#F8FBFE) and Slate Ash (#3E4A5B).
- **Don't** use loud neon colors, generic corporate blue (#0066FF), or sterile glassmorphism that conflicts with cozy paper scrapbook craft.
- **Don't** use cursive or handwriting fonts for system UI controls, button labels, or data tables; reserve cursive exclusively for personal notes, doodles, and letters.
- **Don't** add flat digital cards without paper elevation, tape pins, or physical tactile cues.
- **Don't** create stiff, perfectly aligned tables where an organic scrapbook layout is expected.
