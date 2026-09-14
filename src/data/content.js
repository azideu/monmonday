export const birthdayConfig = {
  celebrant: {
    name: "Monmonkyu",
    birthdayDate: "September 14",
    title: "Happy Birthday Monmonkyu!",
    subtitle: "A digital scrapbook woven with memories, letters, and wishes from all of us.",
  },

  // Background audio playlist
  // Note: Supports direct audio URLs (.mp3, .ogg, etc.) or synthesized melodic chimes
  playlist: [
    {
      id: "track-1",
      title: "Sunny Afternoon Memories",
      artist: "Acoustic Friends",
      duration: "2:45",
      // Reliable public domain / free acoustic lofi audio sample
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
      relationship: "Best Friend since High School",
      envelopeColor: "bg-[#D4F1FF]", // Sky Mist
      sealColor: "#FFD6D6", // Soft Coral Blush
      sealIcon: "🌸",
      stampText: "AIR MAIL",
      date: "Sep 14, 2026",
      type: "typed", // 'typed' or 'handwritten'
      preview: "To the person who makes every boring Tuesday feel like an adventure...",
      content: `Dear Monmonkyu,

Happy, happy birthday! Looking back at this past year, I honestly don't know what I would have done without our 2 AM voice notes and spontaneous boba runs.

You have this rare gift of making everyone in the room feel heard and valued. Never lose that spark of curiosity and infectious laughter that pulls everyone in.

May this year bring you all the quiet peace you deserve and all the wild adventures your heart is craving. Here's to another year of shared jokes, bad karaoke, and memories we'll still be laughing about when we're 80.

With so much love,
Maya ❤️`,
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
      preview: "Remember that time we got completely lost in the fog on Mt. Tam...",
      content: `Hey buddy,

Happy Birthday! 

Remember that time we got completely soaked on the trail and ended up eating squished PB&J sandwiches under a tarp? That's still hands down one of our favorite days ever. You were the only one who kept our spirits high by making up ridiculous songs.

You are the most dependable, kind-hearted friend anyone could ask for on any trail—literal or metaphorical. 

Have the happiest celebration today! Next summit trip is on us.

Cheers,
Jordan & Sam 🥾`,
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
      preview: "My sweetest grandchild, watching you grow into such a kind soul...",
      content: `My dearest Monmonkyu,

Watching you grow into such a gracious, caring, and radiant human being has been the greatest joy of my life.

I still remember when you were small enough to fit on my lap, asking endless questions about how birds fly and why the ocean is blue. You still carry that same bright wonder in your eyes today.

Always remember that you are deeply loved, no matter how far apart we might be. Eat an extra slice of cake for me today!

All my love and blessings,
Grandma Elena ✨`,
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
      preview: "Another year wiser, though we still argue about how to make coffee...",
      content: `Monmonkyu!

Happy birthday man! Still can't believe another year has flown by. Thinking back to our dorm days studying until sunrise with bad instant ramen—we've come a long way.

I'm so proud of everything you've accomplished this year. You've worked tirelessly, stayed humble, and always made time for the people around you.

Let's catch up properly this weekend. First round of coffee is definitely on you though 😉

Your bro,
Chris ☕`,
    }
  ],

  // Polaroid memories with secret notes on reverse side
  polaroids: [
    {
      id: "photo-1",
      imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80",
      caption: "Summer bonfire night by the lake 🔥",
      date: "July 2025",
      location: "Pine Lake",
      tapeColor: "bg-[#D4F1FF]/80", // Sky Mist
      tapeRotation: "-2deg",
      cardTilt: "-3deg",
      backNote: "We burned half the marshmallows and sang along to 2000s throwbacks until 3 AM. One of the best nights of our lives.",
      doodle: "✨ ⛺ ✨",
    },
    {
      id: "photo-2",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
      caption: "Spontaneous roadtrip to the coast 🌊",
      date: "October 2025",
      location: "Big Sur",
      tapeColor: "bg-[#FFEE8C]/80", // Buttercup
      tapeRotation: "3deg",
      cardTilt: "2deg",
      backNote: "Our tire almost gave up on Highway 1, but this sunset stop made every bit of stress melt away instantly.",
      doodle: "🚗 💨 🌅",
    },
    {
      id: "photo-3",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80",
      caption: "Surprise picnic that almost got rained out 🧺",
      date: "April 2026",
      location: "Golden Park",
      tapeColor: "bg-[#D4F1FF]/90", // Sky Mist
      tapeRotation: "-1.5deg",
      cardTilt: "-1.5deg",
      backNote: "Five minutes after this picture was taken, the heavens opened up and we had to sprint under the gazebo holding the pizza box like a shield.",
      doodle: "🍕 ☔ 🏃",
    },
    {
      id: "photo-4",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
      caption: "Last year's birthday blowout 🎉",
      date: "September 2025",
      location: "Rooftop Studio",
      tapeColor: "bg-[#D4F1FF]/80", // Sky Mist
      tapeRotation: "2.5deg",
      cardTilt: "3.5deg",
      backNote: "Look at that genuine smile! Hope this year brings twice as many laughs and memories.",
      doodle: "🎂 🎈 🥳",
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
    wishPrompt: "Make a wish and click to blow out the candle!",
    blownMessage: "✨ Wish granted! May this year be your brightest chapter yet. ✨",
  }
};
