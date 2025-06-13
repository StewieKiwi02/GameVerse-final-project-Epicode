const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'relatedModel',  // opzionale per riferimento dinamico
  },
  relatedModel: {
    type: String,
    required: true,
    enum: ['Game'],
    default: 'Game',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
