require('dotenv').config();
const mongoose = require('mongoose');
const Platform = require('../models/Platform');

const platforms = [
  "PlayStation 5",
  "Xbox Series X/S",
  "Nintendo Switch",
  "PlayStation 4",
  "PlayStation 3",
  "Xbox One",
  "Xbox 360",
  "Nintendo Wii U",
  "Nintendo Wii",
  "Nintendo DS",
  "Nintendo 3DS",
  "PlayStation Vita",
  "PlayStation Portable (PSP)",
  "PlayStation 2",
  "PlayStation",
  "Xbox",
  "GameCube",
  "Nintendo 64",
  "Super Nintendo (SNES)",
  "NES",
  "Sega Genesis",
  "Sega Dreamcast",
  "Atari 2600",
  "PC",
  "Mac",
  "Linux",
  "Android",
  "iOS",
  "Browser",
  "VR (Oculus Rift, Quest, HTC Vive)",
  "Stadia",
  "Amazon Luna",
  "Steam Deck"
];

const seedPlatforms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connesso al DB per il seeding delle piattaforme');

    // Pulizia della collection piattaforme
    await Platform.deleteMany({});

    const platformDocs = platforms.map(name => ({ platform: name }));

    await Platform.insertMany(platformDocs);
    console.log('Piattaforme inserite con successo!');
  } catch (error) {
    console.error('Errore nel seeding delle piattaforme:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedPlatforms();
