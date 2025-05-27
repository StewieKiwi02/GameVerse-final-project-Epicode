const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categoriesToInsert = [
  "Action",
  "Adventure",
  "Role-Playing (RPG)",
  "Simulation",
  "Strategy",
  "Sports",
  "Puzzle",
  "Shooter",
  "Platformer",
  "Fighting",
  "Racing",
  "Horror",
  "Survival",
  "Stealth",
  "MMO",
  "Sandbox",
  "Indie",
  "Casual",
  "Free-to-Play",
  "Educational",
  "Music/Rhythm",
  "Visual Novel",
  "VR",
  "Party",
  "Beat 'em up",
  "Card Game",
  "Board Game",
  "Text-Based",
  "Turn-Based",
  "Real-Time",
  "Tactical",
  "Metroidvania",
  "Tower Defense",
  "Idle/Incremental",
  "Battle Royale"
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connesso a MongoDB');

    for (const cat of categoriesToInsert) {
      const exists = await Category.findOne({ category: cat });
      if (!exists) {
        await Category.create({ category: cat });
        console.log(`Inserita categoria: ${cat}`);
      } else {
        console.log(`Categoria già presente: ${cat}`);
      }
    }

    console.log('Seed completato');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Errore nel seed delle categorie:', error);
  }
}

seedCategories();
