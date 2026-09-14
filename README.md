# 🎂 MonMonday - Birthday Scrapbook Website

An interactive, tactile digital scrapbook memory board crafted for a friend's birthday celebration.

Built with **React + Vite + Tailwind CSS + Framer Motion + Lucide Icons + Canvas Confetti**.

---

## 🎨 Color Palette ([colors.md](colors.md))

| Role | Color Name | Hex Code | Purpose in App |
| --- | --- | --- | --- |
| **Primary Base** | Sky Mist | `#D4F1FF` | Cassette player body, washi tapes, scrollbar |
| **Accent Primary** | Buttercup Glow | `#FFEE8C` | Candle flame, cassette labels, selection highlight |
| **Accent Secondary** | Pastel Mint | `#C8F7DC` | Postage stamps, badges, success banners |
| **Warm Accent** | Soft Coral Blush | `#FFD6D6` | Wax seals, cake icing, hearts |
| **Lavender Accent** | Pale Lilac | `#E5DBFF` | Decorative badges, special envelopes |
| **Neutral Background** | Cloud White | `#F8FBFE` | Paper texture ground, card bases |
| **Neutral Deep** | Slate Ash | `#3E4A5B` | Readable vintage ink typography & borders |

---

## ✨ Features

1. **Retro Cassette Tape Player**
   * Spinning reel spools synchronized with playback.
   * Play/pause, next/prev tracks, and volume slider.
   * Web Audio chime fallback if external audio files are unreachable.
   * Graceful "Turn On Music" welcome card to comply with browser autoplay policies.

2. **Scattered Polaroids with 3D Flip**
   * Authentic instant photo styling with washi tape accents and subtle natural tilts.
   * Clicking flips the photo 180° in 3D to reveal handwritten notes and doodles on the back.

3. **Sealed Letter Envelopes**
   * Pastel envelopes addressed to the celebrant with customized wax seals and airmail stamps.
   * Clicking unfolds the flap and opens a realistic lined stationery modal reader.
   * Supports both typed letters (with handwriting typography) and scanned handwritten letter images.

4. **Birthday Cake & Confetti Surprise**
   * Interactive candle with flickering flame.
   * Click to blow out the candle with smoke animation and multi-stage confetti cannons dyed in the project's pastel colors.
   * Relight button to make multiple wishes!

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## ✍️ Customizing Content for Your Friend

All content is managed in a single file: `src/data/content.js`.

### Change the Celebrant's Info
```javascript
celebrant: {
  name: "",
  birthdayDate: "September 18",
  title: "Happy Birthday Monmonkyu!",
  subtitle: "A digital scrapbook woven with memories, letters, and wishes from all of us.",
}
```

### Add/Edit Letters
Add entries to `birthdayConfig.letters` in `src/data/content.js`:
```javascript
{
  id: "letter-unique-id",
  author: "Friend's Name",
  relationship: "Childhood Friend",
  envelopeColor: "bg-[#D4F1FF]", // or #FFEE8C, #FFD6D6, #E5DBFF
  sealColor: "#FFD6D6",
  sealIcon: "🌸",
  date: "Sep 14, 2026",
  type: "typed", // or 'handwritten' with scanUrl: "/path/to/scan.jpg"
  content: "Your heartfelt letter here...",
}
```

### Add/Edit Photos
Add entries to `birthdayConfig.polaroids` in `src/data/content.js`:
```javascript
{
  id: "photo-unique-id",
  imageUrl: "https://... or /photos/pic.jpg",
  caption: "Beach trip sunset 🌅",
  date: "August 2025",
  location: "Malibu Beach",
  backNote: "The memory note that shows up when the polaroid is flipped!",
  doodle: "✨ 🌊 ☀️",
}
```

### Add Songs
Add MP3 tracks or URLs to `birthdayConfig.playlist` in `src/data/content.js`.
