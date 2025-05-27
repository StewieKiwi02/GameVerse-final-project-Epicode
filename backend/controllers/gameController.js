const Game = require('../models/Game');

const getGames = async (req, res) => {
  try {
    // Costruisco il filtro in base ai query params
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.platform) {
      // Qui supponiamo platforms sia un array, quindi filtro con $in
      filter.platforms = { $in: [req.query.platform] };
    }
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }
    if (req.query.pegi) {
      filter.pegi = req.query.pegi;
    }
    // Puoi aggiungere altri filtri simili se vuoi

    const games = await Game.find(filter)
      .populate('category')
      .populate('platforms')
      .populate('genre')
      .populate('languages.interface')
      .populate('languages.audio')
      .populate('languages.subtitles');

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('category')
      .populate('platforms')
      .populate('genre')
      .populate('languages.interface')
      .populate('languages.audio')
      .populate('languages.subtitles');

    if (!game) return res.status(404).json({ message: 'Gioco non trovato' });

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGame = async (req, res) => {
  try {
    const {
      title,
      coverImage,
      bannerImage,
      description,
      producer,
      category,
      releaseDate,
      platforms,
      genre,
      languages,
      rating,
      playMode,
      trailerUrl,
      pegi,
    } = req.body;

    if (!title || !coverImage || !bannerImage || !producer || !category || !releaseDate || !platforms || !genre || !languages || !rating || !playMode || !pegi) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    const existing = await Game.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Titolo gioco già esistente' });
    }

    const newGame = new Game({
      title: title.trim(),
      coverImage,
      bannerImage,
      description: description ? description.trim() : '',
      producer: producer.trim(),
      category,
      releaseDate,
      platforms,
      genre,
      languages,
      rating,
      playMode,
      trailerUrl,
      pegi,
    });

    await newGame.save();
    const populatedGame = await newGame.populate('category platforms genre languages.interface languages.audio languages.subtitles').execPopulate();

    res.status(201).json(populatedGame);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Gioco non trovato' });

    const fields = [
      'title', 'coverImage', 'bannerImage', 'description', 'producer', 'category', 'releaseDate',
      'platforms', 'genre', 'languages', 'rating', 'playMode', 'trailerUrl', 'pegi'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        game[field] = req.body[field];
      }
    });

    await game.save();

    const populatedGame = await game.populate('category platforms genre languages.interface languages.audio languages.subtitles').execPopulate();

    res.json(populatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Gioco non trovato' });

    await game.remove();
    res.json({ message: 'Gioco rimosso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
