const express = require('express');
const mongoose = require('mongoose');
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

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID non valido' });
  }
  next();
}

router.get('/', getLanguages);
router.get('/:id', validateObjectId, getLanguageById);
router.post('/', authMiddleware, admin, createLanguage);
router.put('/:id', authMiddleware, admin, validateObjectId, updateLanguage);
router.delete('/:id', authMiddleware, admin, validateObjectId, deleteLanguage);

module.exports = router;
