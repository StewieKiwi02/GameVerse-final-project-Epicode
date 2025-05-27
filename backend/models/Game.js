const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    coverImage:{
        type: String, //URL o public_id Cloudinary
        required: true,
    },
    bannerImage: {
        type: String, //URL o public_id Cloudinary
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
    category: [{ //si usa array quando c'è possibilità di più scelte assieme per un unico documento
        type: mongoose.Schema.Types.ObjectId,// Identificatore univoco (ObjectId) di MongoDB, usato per creare un riferimento a un altro documento in un'altra collezione
        ref: 'Category', // riferimento allo Schema Category
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
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,
    }],
    languages: {
        interface: [{
            type:mongoose.Schema.Types.ObjectId,
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
            validator: Number.isInteger, //funzione built-in di JS che passa true se passa un numero intero, altrimenti da false
            message: 'La valutazione deve essere un numero intero tra 1 e 5',
        },
        required: true,
    },
    playMode: {
        type: String,
        enum: ['singleplayer', 'multiplayer', 'both'], //limita scelta valori a quelli indicati
        required: true,
    },
    trailerUrl: {
        type: String,
        required: false, //rende opzionale
        validate: {
            validator: function(v) {
            return /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(v); // regex semplice per validare URL (https:// o http://)
            },
            message: props => `${props.value} non è un URL valido!`
        }
    },
    pegi: {
        type: String,
        enum: ['3', '7', '12', '16', '18'], // standard PEGI
        required: true,
    },
},

    {
        timestamps: true,
    },

);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;