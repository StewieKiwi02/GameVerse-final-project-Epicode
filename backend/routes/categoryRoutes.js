const express = require('express');
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const authMiddleware = require('../middleware/userAuth');
const admin = require('../middleware/adminAuth');

// Rotte pubbliche (GET)
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rotte protette (solo admin)
router.post('/', authMiddleware, admin, createCategory);
router.put('/:id', authMiddleware, admin, updateCategory);
router.delete('/:id', authMiddleware, admin, deleteCategory);

module.exports = router;
