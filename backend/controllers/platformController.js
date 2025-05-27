const Platform = require('../models/Platform');

// GET tutte le piattaforme
const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find();
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET piattaforma per ID
const getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) return res.status(404).json({ message: 'Piattaforma non trovata' });
    res.json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST crea nuova piattaforma (solo admin)
const createPlatform = async (req, res) => {
  try {
    const { platform } = req.body;
    if (!platform) return res.status(400).json({ message: 'Piattaforma obbligatoria' });

    const newPlatform = new Platform({ platform });
    await newPlatform.save();

    res.status(201).json(newPlatform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT aggiorna piattaforma (solo admin)
const updatePlatform = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) return res.status(404).json({ message: 'Piattaforma non trovata' });

    platform.platform = req.body.platform || platform.platform;
    await platform.save();

    res.json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE piattaforma (solo admin)
const deletePlatform = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);
    if (!platform) return res.status(404).json({ message: 'Piattaforma non trovata' });

    await platform.remove();
    res.json({ message: 'Piattaforma rimossa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
};
