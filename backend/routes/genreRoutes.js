const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID non valido' });
  }
  next();
}

// GET tutti i generi – accesso pubblico
router.get('/', getGenres);

// GET singolo genere per ID – accesso pubblico
router.get('/:id', validateObjectId, getGenreById);

// POST nuovo genere – solo admin
router.post('/', authMiddleware, admin, createGenre);

// PUT aggiornamento genere – solo admin
router.put('/:id', authMiddleware, admin, validateObjectId, updateGenre);

// DELETE rimozione genere – solo admin
router.delete('/:id', authMiddleware, admin, validateObjectId, deleteGenre);

module.exports = router;
