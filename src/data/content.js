export const birthdayConfig = {
  celebrant: {
    name: "Monmonkyu",
    birthdayDate: "September 14",
    title: "Happy Birthday Monmonkyu!",
    subtitle: "We pulled together some favorite photos, letters from everyone, and a playlist for your birthday.",
  },

  // Background audio playlist
  playlist: [
    {
      id: "track-1",
      title: "Sunny Afternoon Memories",
      artist: "Acoustic Friends",
      duration: "2:45",
      audioUrl: "https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3",
    },
    {
      id: "track-2",
      title: "Late Night Heart to Hearts",
      artist: "Cozy Tape Sessions",
      duration: "3:12",
      audioUrl: "https://cdn.freesound.org/previews/416/416632_5121236-lq.mp3",
    },
    {
      id: "track-3",
      title: "Birthday Ukulele Strum",
      artist: "The Porch Jam",
      duration: "1:58",
      audioUrl: "https://cdn.freesound.org/previews/464/464902_5674468-lq.mp3",
    }
  ],

  // Letters from friends
  letters: [
    {
      id: "letter-1",
      author: "Maya",
      relationship: "Best Friend",
      envelopeColor: "bg-[#D4F1FF]", // Sky Mist
      sealColor: "#FFD6D6", // Soft Coral Blush
      sealIcon: "🌸",
      stampText: "AIR MAIL",
      date: "Sep 14, 2026",
      type: "typed",
      preview: "Looking back at photos from this past year, almost half of them involve our 2 AM voice notes...",
      content: `Happy birthday Monmonkyu!

I was looking back at photos from this past year and realized almost half of them involve our 2 AM voice notes, ridiculous inside jokes, and those last-minute boba runs when neither of us felt like doing actual work.

You are genuinely the first person I message when weird things happen during my day, mostly because I know you will laugh before asking if I am okay. Thank you for always being in my corner, even when my ideas make zero sense.

I hope today is quiet and relaxing, you get food you actually enjoy, and we make time for another terrible karaoke session soon.

Love you lots,
Maya`,
    },
    {
      id: "letter-2",
      author: "Jordan & Sam",
      relationship: "The Hiking Trio",
      envelopeColor: "bg-[#FFEE8C]", // Buttercup Glow
      sealColor: "#C8F7DC", // Pastel Mint
      sealIcon: "🌿",
      stampText: "PRIORITY",
      date: "Sep 13, 2026",
      type: "typed",
      preview: "We were just talking about that hike where it started downpouring two miles from the car...",
      content: `Hey buddy,

Happy birthday!

We were just talking about that hike where it started pouring two miles from the car and we sheltered under that half-broken tarp eating squished peanut butter sandwiches. You somehow stayed in a great mood the entire time, singing early 2000s pop songs completely off-key.

Seriously, you are always the first person we text when planning any trip. Everything is just way more fun when you are there.

Have a great birthday. The next camp food run is on us.

Jordan & Sam`,
    },
    {
      id: "letter-3",
      author: "Grandma Elena",
      relationship: "Grandmother",
      envelopeColor: "bg-[#FFD6D6]", // Soft Coral Blush
      sealColor: "#E5DBFF", // Pale Lilac
      sealIcon: "💌",
      stampText: "FIRST CLASS",
      date: "Sep 12, 2026",
      type: "typed",
      preview: "I was thinking about you this morning and remembering when you were little...",
      content: `My dearest Monmonkyu,

Happy birthday!

I was thinking about you this morning and remembering when you were small, sitting on the kitchen counter asking a hundred questions while I tried to bake cookies. You still have that same curious, thoughtful nature today.

I am so proud of the person you have grown into, and how kindly you treat the people around you.

Make sure you eat a very big slice of cake today. Sending you my love and a big hug.

Grandma Elena`,
    },
    {
      id: "letter-4",
      author: "Chris",
      relationship: "College Roommate",
      envelopeColor: "bg-[#E5DBFF]", // Pale Lilac
      sealColor: "#FFEE8C", // Buttercup Glow
      sealIcon: "☕",
      stampText: "SPECIAL",
      date: "Sep 14, 2026",
      type: "typed",
      preview: "Still wild thinking about our dorm days living off instant noodles and barely surviving finals week...",
      content: `Monmonkyu!

Happy birthday man! Still wild thinking about our dorm days living off instant noodles and barely surviving finals week.

You have had a huge year and it has been great watching you pull everything off without losing your mind in the process.

Let us get dinner together this weekend. First round of coffee is on you though.

Chris`,
    }
  ],

  // Polaroid memories with secret notes on reverse side
  polaroids: [
    {
      id: "photo-1",
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80",
      caption: "Campfire by the lake",
      date: "July 2025",
      location: "Pine Lake",
      tapeColor: "bg-[#D4F1FF]/80", // Sky Mist
      tapeRotation: "-2deg",
      cardTilt: "-3deg",
      backNote: "We burned half the marshmallows, dropped the graham crackers in the dirt, and talked until 3 AM.",
      doodle: "⛺",
    },
    {
      id: "photo-2",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
      caption: "Road trip stop along the coast",
      date: "October 2025",
      location: "Big Sur",
      tapeColor: "bg-[#FFEE8C]/80", // Buttercup
      tapeRotation: "3deg",
      cardTilt: "2deg",
      backNote: "The car made a terrifying rattling noise right before this turn, but this view made everyone forget about it.",
      doodle: "🚗",
    },
    {
      id: "photo-3",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80",
      caption: "Picnic in the park",
      date: "April 2026",
      location: "Golden Park",
      tapeColor: "bg-[#D4F1FF]/90", // Sky Mist
      tapeRotation: "-1.5deg",
      cardTilt: "-1.5deg",
      backNote: "About five minutes after this picture, it started pouring and we had to sprint for the gazebo with the pizza boxes.",
      doodle: "🍕",
    },
    {
      id: "photo-4",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
      caption: "Birthday party last year",
      date: "September 2025",
      location: "Rooftop Studio",
      tapeColor: "bg-[#D4F1FF]/80", // Sky Mist
      tapeRotation: "2.5deg",
      cardTilt: "3.5deg",
      backNote: "Still laughing at how the candles on that cake managed to set off the smoke alarm almost immediately.",
      doodle: "🎂",
    }
  ],

  // Interactive cake & celebration
  celebration: {
    wishesCount: 1,
    confettiColors: [
      '#D4F1FF', // Sky Mist (Primary)
      '#D4F1FF', // Sky Mist (Weighted)
      '#BEE7FD', // Sky Mist Light Tint
      '#FFEE8C', // Buttercup Glow
      '#C8F7DC', // Pastel Mint
      '#FFD6D6', // Soft Coral Blush
      '#E5DBFF', // Pale Lilac
    ],
    wishPrompt: "Make a wish, then click the candle to blow it out.",
    blownMessage: "Candle blown! Hope this year treats you well.",
  }
};
