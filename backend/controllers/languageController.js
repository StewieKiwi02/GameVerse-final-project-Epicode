const Language = require('../models/Language');

// GET tutte le lingue
const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET lingua per ID
const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Lingua non trovata' });
    res.json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST crea nuova lingua (solo admin)
const createLanguage = async (req, res) => {
  try {
    const { name, isoCode } = req.body;
    if (!name || !isoCode) return res.status(400).json({ message: 'Nome e ISO code sono obbligatori' });

    const existing = await Language.findOne({ $or: [{ name: name.toLowerCase() }, { isoCode: isoCode.toUpperCase() }] });
    if (existing) return res.status(409).json({ message: 'Lingua già presente' });

    const newLanguage = new Language({
      name: name.toLowerCase().trim(),
      isoCode: isoCode.toUpperCase().trim(),
    });

    await newLanguage.save();
    res.status(201).json(newLanguage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT aggiorna lingua (solo admin)
const updateLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Lingua non trovata' });

    if (req.body.name) language.name = req.body.name.toLowerCase().trim();
    if (req.body.isoCode) language.isoCode = req.body.isoCode.toUpperCase().trim();

    await language.save();
    res.json(language);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE lingua (solo admin)
const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Lingua non trovata' });

    await language.remove();
    res.json({ message: 'Lingua rimossa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
