const Comment = require('../models/Comment');

// Crea un nuovo commento
const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const comment = new Comment({
      postId,
      user: req.user._id,
      text,
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Errore creazione commento', error: error.message });
  }
};

// Ottieni tutti i commenti di un post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore recupero commenti', error: error.message });
  }
};

// Aggiorna un commento
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Non autorizzato.' });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Errore aggiornamento commento', error: error.message });
  }
};

// Elimina un commento
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Commento non trovato' });

    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
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
  getCommentsByPost,
  updateComment,
  deleteComment,
};
