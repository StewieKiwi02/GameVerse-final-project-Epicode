const Game = require("../models/Game");

// GET paginato con filtri e supporto scroll infinito/pulsanti
const getGames = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.platform) filter.platforms = { $in: [req.query.platform] };
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.pegi) filter.pegi = req.query.pegi;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [total, games] = await Promise.all([
      Game.countDocuments(filter),
      Game.find(filter)
        .populate("category")
        .populate("platforms")
        .populate("genre")
        .populate("languages.interface")
        .populate("languages.audio")
        .populate("languages.subtitles")
        .skip(skip)
        .limit(limit)
    ]);

    res.json({ games, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Errore getGames:", error);
    res.status(500).json({ message: "Errore interno nel caricamento giochi" });
  }
};

// SEARCH by titolo (senza paginazione)
const searchGames = async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";
    const regex = new RegExp(q, "i");

    const games = await Game.find({ title: regex })
      .populate("category")
      .populate("platforms")
      .populate("genre")
      .populate("languages.interface")
      .populate("languages.audio")
      .populate("languages.subtitles");

    res.json({ games, total: games.length });
  } catch (error) {
    console.error("Errore searchGames:", error);
    res.status(500).json({ message: "Errore interno nella ricerca giochi" });
  }
};

// GET singolo gioco per ID
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate("category")
      .populate("platforms")
      .populate("genre")
      .populate("languages.interface")
      .populate("languages.audio")
      .populate("languages.subtitles");

    if (!game) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }

    res.json(game);
  } catch (error) {
    console.error("Errore getGameById:", error);
    res.status(500).json({ message: "Errore interno nel recupero gioco" });
  }
};

// CREA nuovo gioco
const createGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Errore createGame:", error);
    res.status(400).json({ message: error.message });
  }
};


// MODIFICA gioco esistente
const updateGame = async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGame) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }
    res.json(updatedGame);
  } catch (error) {
    console.error("Errore updateGame:", error);
    res.status(400).json({ message: "Errore aggiornamento gioco" });
  }
};

// ELIMINA gioco
const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ message: "Gioco non trovato" });
    }
    res.json({ message: "Gioco eliminato con successo" });
  } catch (error) {
    console.error("Errore deleteGame:", error);
    res.status(500).json({ message: "Errore interno eliminazione gioco" });
  }
};

module.exports = {
  getGames,
  searchGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
