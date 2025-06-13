const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByGame,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const authMiddleware = require('../middleware/userAuth');

// Recupera tutti i commenti di un gioco (pubblico)
router.get('/game/:gameId', getCommentsByGame);

// Crea un nuovo commento (solo utenti autenticati)
router.post('/', authMiddleware, createComment);

// Aggiorna un commento (solo autore o admin)
router.put('/:id', authMiddleware, updateComment);

// Elimina un commento (solo autore o admin)
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
