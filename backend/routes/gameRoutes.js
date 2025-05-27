const express = require('express');
const router = express.Router();

const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require('../controllers/gameController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', authMiddleware, admin, createGame);
router.put('/:id', authMiddleware, admin, updateGame);
router.delete('/:id', authMiddleware, admin, deleteGame);

module.exports = router;
