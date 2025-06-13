const Comment = require('../models/Comment');

// Crea un nuovo commento per gioco
const createComment = async (req, res) => {
  try {
    const { relatedTo, content, rating } = req.body;
    if (!content || !rating || !relatedTo) {
      return res.status(400).json({ message: 'Contenuto, rating e ID gioco sono obbligatori' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating deve essere tra 1 e 5' });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      relatedTo,
      relatedModel: 'Game',
      rating,
    });

    const savedComment = await comment.save();
    await savedComment.populate('author', 'username profilePic');
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Errore creazione commento', error: error.message });
  }
};

// Recupera tutti i commenti di un gioco
const getCommentsByGame = async (req, res) => {
  try {
    const comments = await Comment.find({
      relatedTo: req.params.gameId,
      relatedModel: 'Game',
    })
    .populate('author', 'username profilePic')
    .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore recupero commenti gioco', error: error.message });
  }
};

// Aggiorna commento (solo autore o admin)
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorizzato.' });
    }

    comment.content = req.body.content || comment.content;
    if (req.body.rating && req.body.rating >=1 && req.body.rating <=5) {
      comment.rating = req.body.rating;
    }
    await comment.save();

    await comment.populate('author', 'username profilePic');
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore aggiornamento commento', error: error.message });
  }
};

// Elimina commento (solo autore o admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorizzato.' });
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Commento eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore eliminazione commento', error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByGame,
  updateComment,
  deleteComment,
};
