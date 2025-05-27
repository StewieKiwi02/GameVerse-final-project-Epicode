const express = require('express');
const router = express.Router();

const {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreController');

const auth = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

// GET tutti i generi – accesso pubblico
router.get('/', getGenres);

// GET singolo genere per ID – accesso pubblico
router.get('/:id', getGenreById);

// POST nuovo genere – solo admin
router.post('/', auth, admin, createGenre);

// PUT aggiornamento genere – solo admin
router.put('/:id', auth, admin, updateGenre);

// DELETE rimozione genere – solo admin
router.delete('/:id', auth, admin, deleteGenre);

module.exports = router;
