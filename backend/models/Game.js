const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    producer: {
        type: String,
        trim: true,
        required: true,
    },
    category: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    releaseDate: {
        type: Date,
        required: true,
    },
    platforms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Platform',
        required: true,
    }],
    genre: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    }],
    languages: {
        interface: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language',
            required: true,
        }],
        audio: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language',
            required: true,
        }],
        subtitles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language',
            required: true,
        }],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'La valutazione deve essere un numero intero tra 1 e 5',
        },
        required: true,
    },
    playMode: {
        type: String,
        enum: ['singleplayer', 'multiplayer', 'singleplayer-multiplayer'],
        required: true,
    },
    trailerUrl: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(v);
            },
            message: props => `${props.value} non è un URL valido!`
        }
    },
    pegi: {
        type: String,
        enum: ['3', '7', '12', '16', '18'],
        required: true,
    },

    averageRating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5,
    },

}, {
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
