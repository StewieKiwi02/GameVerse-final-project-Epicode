const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // utile per confronti più facili e coerenza
  },
  isoCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // es: IT, EN, FR
    minlength: 2,
    maxlength: 3,
  }
}, {
  timestamps: true,
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
