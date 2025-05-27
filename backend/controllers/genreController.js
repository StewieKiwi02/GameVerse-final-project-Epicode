const Genre = require('../models/Genre');

// GET tutti i generi
const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei generi' });
  }
};

// GET genere per ID
const getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (genre) {
      res.json(genre);
    } else {
      res.status(404).json({ message: 'Genere non trovato' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del genere' });
  }
};

// POST crea un nuovo genere
const createGenre = async (req, res) => {
  const { genre } = req.body;

  if (!genre) {
    return res.status(400).json({ message: 'Il campo genre è obbligatorio' });
  }

  try {
    const newGenre = new Genre({ genre });
    await newGenre.save();
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione del genere' });
  }
};

// PUT aggiorna un genere esistente
const updateGenre = async (req, res) => {
  const { genre } = req.body;

  try {
    const updatedGenre = await Genre.findByIdAndUpdate(
      req.params.id,
      { genre },
      { new: true, runValidators: true }
    );

    if (updatedGenre) {
      res.json(updatedGenre);
    } else {
      res.status(404).json({ message: 'Genere non trovato' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del genere' });
  }
};

// DELETE elimina un genere
const deleteGenre = async (req, res) => {
  try {
    const deleted = await Genre.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: 'Genere eliminato correttamente' });
    } else {
      res.status(404).json({ message: 'Genere non trovato' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione del genere' });
  }
};

module.exports = {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
};
