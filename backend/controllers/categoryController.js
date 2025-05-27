const Category = require('../models/Category');

// GET tutte le categorie
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ category: 1 }); // ordine alfabetico
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero delle categorie', error: error.message });
  }
};

// GET categoria per ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoria non trovata' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero della categoria', error: error.message });
  }
};

// POST crea nuova categoria
const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    // Controllo se la categoria è tra gli enum ammessi
    if (!Category.schema.path('category').enumValues.includes(category)) {
      return res.status(400).json({ message: 'Valore categoria non valido' });
    }

    // Controllo se categoria esiste già
    const categoryExists = await Category.findOne({ category });
    if (categoryExists) return res.status(400).json({ message: 'Categoria già esistente' });

    const newCategory = new Category({ category });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione della categoria', error: error.message });
  }
};

// PUT aggiorna categoria
const updateCategory = async (req, res) => {
  try {
    const { category } = req.body;

    // Controllo enum
    if (!Category.schema.path('category').enumValues.includes(category)) {
      return res.status(400).json({ message: 'Valore categoria non valido' });
    }

    const categoryToUpdate = await Category.findById(req.params.id);
    if (!categoryToUpdate) return res.status(404).json({ message: 'Categoria non trovata' });

    categoryToUpdate.category = category;
    await categoryToUpdate.save();

    res.json(categoryToUpdate);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento della categoria', error: error.message });
  }
};

// DELETE categoria
const deleteCategory = async (req, res) => {
  try {
    const categoryToDelete = await Category.findById(req.params.id);
    if (!categoryToDelete) return res.status(404).json({ message: 'Categoria non trovata' });

    await categoryToDelete.remove();
    res.json({ message: 'Categoria eliminata con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminazione della categoria', error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
