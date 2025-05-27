const express = require('express');
const router = express.Router();

const {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
} = require('../controllers/platformController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

router.get('/', getPlatforms);
router.get('/:id', getPlatformById);
router.post('/', authMiddleware, admin, createPlatform);
router.put('/:id', authMiddleware, admin, updatePlatform);
router.delete('/:id', authMiddleware, admin, deletePlatform);

module.exports = router;
