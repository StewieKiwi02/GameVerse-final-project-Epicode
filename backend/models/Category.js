const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    category: {
    type: String,
    enum: [
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
    ],
    required: true,
    },

},

    {
        timestamps: true,
    },

);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;