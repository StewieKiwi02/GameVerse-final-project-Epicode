const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    banner: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    bio: {
        type: String,
        default: '',
        maxLength: 300,
        trim: true,
    },
    password: {
        type: String,
        maxLength: 100,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    themePreference: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        match: [/^\d{8,15}$/, 'Numero di cellulare non valido'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email non valida'],
    },
    birthday: {
        type: Date,
        required: false,
    },
    social: {
        facebook: { type: String, default: '', trim: true },
        twitter: { type: String, default: '', trim: true },
        instagram: { type: String, default: '', trim: true },
        youtube: { type: String, default: '', trim: true },
        medium: { type: String, default: '', trim: true },
        github: { type: String, default: '', trim: true },
    },
    library: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    }],
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
