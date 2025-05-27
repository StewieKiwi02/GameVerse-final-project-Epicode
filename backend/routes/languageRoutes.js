const express = require('express');
const router = express.Router();

const {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require('../controllers/languageController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

router.get('/', getLanguages);
router.get('/:id', getLanguageById);
router.post('/', authMiddleware, admin, createLanguage);
router.put('/:id', authMiddleware, admin, updateLanguage);
router.delete('/:id', authMiddleware, admin, deleteLanguage);

module.exports = router;
