const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    genre: {
    type: String,
    enum: [
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
    ],
    required: true,
    }
},

    {
        timestamps: true,
    },

);


const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;




