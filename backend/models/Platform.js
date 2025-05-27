const mongoose = require('mongoose');

const platformSchema = mongoose.Schema({

    platform: {
        type: String,
        enum:[
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
        ],
        required: true,
    },
  
},

    {
        timestamps: true,
    },

);


const Platform = mongoose.model('Platform', platformSchema);

module.exports = Platform;