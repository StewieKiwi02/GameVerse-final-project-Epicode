const express = require('express');
const router = express.Router();

const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  searchGames,
} = require('../controllers/gameController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

const upload = require('../middleware/upload');

// Rotta per ricerca giochi
router.get('/search', searchGames);

// Rotte base
router.get('/', getGames);
router.get('/:id', getGameById);

// Upload locale immagine copertina in public/assets/games
router.post(
  '/',
  authMiddleware,
  upload.single('coverImage'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File immagine mancante' });
      }

      // Salva solo il percorso relativo per l'accesso pubblico
      req.body.coverImage = `/assets/games/${req.file.filename}`;

      // Continua con il controller
      return createGame(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// Update e delete (solo admin)
router.put('/:id', authMiddleware, admin, updateGame);
router.delete('/:id', authMiddleware, admin, deleteGame);

module.exports = router;
