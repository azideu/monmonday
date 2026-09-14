# Monmonkyu: Birthday Scrapbook

A digital scrapbook website for a friend's birthday, with photos, letters from friends, background music, and an interactive birthday candle.

Built with React, Vite, Tailwind CSS, Framer Motion, and Canvas Confetti.

## Color palette

The colors come from [colors.md](colors.md), with Sky Mist as the primary color across the background and UI elements.

| Role | Color name | Hex code | Where it is used |
| --- | --- | --- | --- |
| Primary base (main) | Sky Mist | `#D4F1FF` | Page background, tape strips, cassette player body, nav accents, buttons |
| Accent primary | Buttercup Glow | `#FFEE8C` | Candle flame, cassette labels |
| Accent secondary | Pastel Mint | `#C8F7DC` | Postage cancellation stamps, photo tape strips |
| Warm accent | Soft Coral Blush | `#FFD6D6` | Wax seals, cake icing, hearts |
| Lavender accent | Pale Lilac | `#E5DBFF` | Decorative badges, envelopes |
| Neutral background | Cloud White | `#F8FBFE` | Cards, polaroid borders, stationery paper |
| Neutral deep | Slate Ash | `#3E4A5B` | Text, borders, and icons |

## What is in the site

- Cassette player: Plays background music with animated spinning tape reels. If audio files cannot be loaded, it falls back to synthesized chimes through the Web Audio API.
- Polaroids: Photos displayed with tape accents. Clicking a photo flips it over to show a handwritten note on the back.
- Envelopes: Envelopes sealed with wax stamps. Clicking one opens a lined stationery reader with the letter.
- Birthday candle: An interactive candle on a cake. Clicking blows out the flame and triggers confetti in the palette colors.

## Running the project

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Changing the content

All the letters, photos, and songs live in `src/data/content.js`.

### Celebrant details
Edit the name, date, and headings in `birthdayConfig.celebrant`:
```javascript
celebrant: {
  name: "Monmonkyu",
  birthdayDate: "September 14",
  title: "Happy Birthday Monmonkyu!",
  subtitle: "A collection of photos, letters, and tunes for your birthday.",
}
```

### Letters
Add or modify entries in `birthdayConfig.letters`:
```javascript
{
  id: "letter-1",
  author: "Maya",
  relationship: "Best Friend",
  envelopeColor: "bg-[#D4F1FF]",
  sealColor: "#FFD6D6",
  sealIcon: "🌸",
  date: "Sep 14, 2026",
  type: "typed", // or "handwritten" with scanUrl
  content: "Your letter text goes here...",
}
```

### Photos
Add or modify entries in `birthdayConfig.polaroids`:
```javascript
{
  id: "photo-1",
  imageUrl: "https://... or /photos/pic.jpg",
  caption: "Campfire night",
  date: "July 2025",
  location: "Pine Lake",
  backNote: "Note written on the back of the photo.",
  doodle: "⛺",
}
```

### Music
Add your own audio file URLs or paths to `birthdayConfig.playlist`.
