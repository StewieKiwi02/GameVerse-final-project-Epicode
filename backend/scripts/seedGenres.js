const mongoose = require('mongoose');
const Genre = require('../models/Genre');
require('dotenv').config();

const genres = [
  "Action",
  "Adventure",
  "Role-Playing Game (RPG)",
  "Shooter",
  "First-Person Shooter (FPS)",
  "Third-Person Shooter (TPS)",
  "Strategy",
  "Real-Time Strategy (RTS)",
  "Turn-Based Strategy (TBS)",
  "Simulation",
  "Sports",
  "Racing",
  "Fighting",
  "Puzzle",
  "Platformer",
  "Survival",
  "Horror",
  "Stealth",
  "Sandbox",
  "Open World",
  "Indie",
  "Casual",
  "Music/Rhythm",
  "Party",
  "Visual Novel",
  "Educational",
  "Arcade",
  "Battle Royale",
  "Card Game",
  "Multiplayer Online Battle Arena (MOBA)",
  "Turn-Based",
  "Board Game",
  "Virtual Reality (VR)",
  "Text Adventure",
  "Roguelike",
  "Roguelite",
  "Metroidvania",
  "Idle",
  "Narrative-driven",
  "Co-op",
  "Tower Defense",
  "Trivia"
];

const seedGenres = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connesso al DB');

    await Genre.deleteMany();

    for (const genreName of genres) {
      const newGenre = new Genre({ genre: genreName });
      await newGenre.save();
    }

    console.log('Generi seedati con successo');
    process.exit();
  } catch (error) {
    console.error('Errore nel seeding dei generi:', error);
    process.exit(1);
  }
};

seedGenres();
