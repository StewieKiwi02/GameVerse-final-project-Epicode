const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const authMiddleware = require('../middleware/userAuth');

// 📌 Recupera tutti i commenti di un post (pubblico)
router.get('/post/:postId', getCommentsByPost);

// 🔐 Crea un nuovo commento (solo utenti autenticati)
router.post('/', authMiddleware, createComment);

// 🔐 Aggiorna un commento (solo autore o admin)
router.put('/:id', authMiddleware, updateComment);

// 🔐 Elimina un commento (solo autore o admin)
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
