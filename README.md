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
  birthdayDate: "September 18",
  title: "Happy Birthday Monmonkyu!",
  subtitle: "A collection of photos, letters, and tunes for your birthday.",
}
```

### Letters
Add or modify entries in `birthdayConfig.letters`:
```javascript
{
  id: "letter-1",
  author: "akari",
  relationship: "Dear Friend",
  recipientNickname: "Monmonkyu", // Custom nickname written on front of envelope
  envelopeColor: "bg-[#D4F1FF]",
  sealColor: "#FFD6D6",
  sealIcon: "flower",
  date: "Sep 18, 2026",
  type: "typed", // or "handwritten"
  content: "Your letter text goes here...",

  // OPTION 1: Handwritten letter scan
  // Place your image file in public/photos/ or use a web URL
  scanUrl: "/photos/akari_letter_scan.jpg",
  scanCaption: "Handwritten note on stationery",

  // OPTION 2: Attached photos / doodles / memorabilia
  // You can provide multiple photos with captions:
  images: [
    {
      url: "/photos/beach_trip.jpg",
      caption: "Our beach day last summer!",
    },
    {
      url: "/photos/doodle.png",
      caption: "A little doodle I drew for your bday",
    }
  ],
  // OR simply a single image:
  // imageUrl: "/photos/photo.jpg",
  // imageCaption: "A fun memory",
}
```
*Note: Any image or scan can be clicked inside the letter modal to view full-size in a lightbox.*

### Photos (Polaroids)
Add or modify entries in `birthdayConfig.polaroids`:
```javascript
{
  id: "photo-1",
  imageUrl: "/photos/campfire.jpg", // or web URL
  caption: "Campfire night",
  date: "July 2025",
  location: "Pine Lake",
  backNote: "Note written on the back of the photo.",
  doodle: "tent",
}
```

### Desktop Side Margins Decoration
On wider desktop screens (`xl` and `2xl`), the margins are filled with playful scrapbook decorations (photo slots, admission tickets, vintage airmail stamps, and sticky notes). You can configure or add your own photos to these slots in `birthdayConfig.sideMargins` in `src/data/content.js`:

```javascript
sideMargins: {
  left: [
    {
      type: "photo",
      imageUrl: "/photos/side-memory.jpg", // or leave empty for a slot placeholder
      caption: "A favorite snapshot",
      placeholder: "Photo slot",
      tapeColor: "bg-[#D4F1FF]/90",
      rotation: "-3deg",
    },
    {
      type: "ticket",
      category: "BIRTHDAY PASS",
      number: "№ 0918-26",
      title: "All-Day Celebration Pass",
      subtitle: "Good for endless snacks, hugs, and peaceful moments.",
    },
    {
      type: "note",
      text: "Don't forget to eat an extra slice of cake today!",
      author: "The Crew",
    }
  ],
  right: [
    {
      type: "stamp-cluster",
      icon: "flower",
      label: "Airmail to Monmonkyu",
    },
    {
      type: "photo",
      imageUrl: "/photos/smile.jpg",
      caption: "Smile of the year",
    }
  ]
}
```

### Adding Images and Music Files
- Put images or scans in `public/photos/` (e.g. `public/photos/myphoto.jpg`) and reference them in `content.js` as `"/photos/myphoto.jpg"`.
- Put audio in `public/music/` (e.g. `public/music/song.mp3`) and reference them in `content.js` as `"/music/song.mp3"`.
