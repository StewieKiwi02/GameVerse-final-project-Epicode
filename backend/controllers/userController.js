const User = require('../models/User');
const Game = require('../models/Game'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAZIONE
exports.registerUser = async (req, res) => {
  try {
    const { name, surname, username, email, password, birthDate, phone } = req.body;

    if (!name || !surname || !username || !email || !password || !birthDate) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati.' });
    }

    const italianDate = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
    if (!italianDate.test(birthDate)) {
      return res.status(400).json({ message: 'La data di nascita deve essere nel formato gg/mm/aaaa.' });
    }

    const [day, month, year] = birthDate.split('/');
    const formattedBirthDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(formattedBirthDate.getTime())) {
      return res.status(400).json({ message: 'Data di nascita non valida.' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email già in uso.' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username già esistente.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: name.trim(),
      surname: surname.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      birthday: formattedBirthDate,
      phone: phone ? phone.trim() : '',
      profilePic: '/assets/profile/Nothing Profile.jpg',
      library: [],
    });


    await newUser.save();

    res.status(201).json({ message: 'Utente registrato con successo!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email o username già esistenti.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono obbligatorie.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password errata.' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Login avvenuto con successo.',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OTTENERE PROFILO
exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Non autorizzato. Token mancante o non valido.' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero del profilo utente.' });
  }
};

// MODIFICA UTENTE
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      return res.status(400).json({ message: 'Non puoi aggiornare la password da qui.' });
    }

    if (updates.birthday) {
      const dateObj = new Date(updates.birthday);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Data di nascita non valida.' });
      }
      updates.birthday = dateObj;
    }

    if (updates.themePreference && !['light', 'dark'].includes(updates.themePreference)) {
      return res.status(400).json({ message: 'Valore del tema non valido. Deve essere "light" o "dark".' });
    }

    if (updates.social) {
      for (const key of Object.keys(updates.social)) {
        if (typeof updates.social[key] === 'string') {
          updates.social[key] = updates.social[key].trim();
        } else {
          updates.social[key] = '';
        }
      }
    }

    ['name', 'surname', 'username', 'email', 'bio', 'phone', 'banner', 'profilePic'].forEach(field => {
      if (updates[field] && typeof updates[field] === 'string') {
        updates[field] = updates[field].trim();
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCELLAZIONE UTENTE
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// MODIFICA PASSWORD
exports.updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Inserisci la password attuale e quella nuova.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La password attuale non è corretta.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password aggiornata con successo.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// RECUPERA TUTTI GLI UTENTI (solo Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli utenti.' });
  }
};

// CALLBACK GOOGLE OAUTH
exports.authGoogleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la callback di Google.', error: error.message });
  }
};

// PROMUOVI UTENTE A ADMIN
exports.becomeAdmin = async (req, res) => {
  try {
    const { adminPw } = req.body;

    if (!adminPw || adminPw.trim() !== process.env.ADMIN_PASSWORD.trim()) {
      return res.status(403).json({ success: false, message: 'Password admin non corretta.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utente non trovato.' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ success: true, message: 'Ora sei un amministratore.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore durante la promozione ad admin.' });
  }
};

// RIMUOVI RUOLO ADMIN
exports.leaveAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utente non trovato.' });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ success: true, message: 'Hai abbandonato il ruolo admin.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Errore durante l\'abbandono del ruolo admin.' });
  }
};

// Recupera la libreria dell'utente con ricerca e paginazione
exports.getUserLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q = '', page = 1, limit = 9 } = req.query;

    const user = await User.findById(userId).select('library');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    if (!user.library || user.library.length === 0) {
      return res.json({ games: [] });
    }

    const filter = {
      _id: { $in: user.library },
      title: { $regex: q, $options: 'i' },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const games = await Game.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .select('_id title coverImage')
      .lean();

    res.json({ games });
  } catch (error) {
    console.error('Errore getUserLibrary:', error);
    res.status(500).json({ message: 'Errore durante il recupero della libreria.' });
  }
};

// Aggiungi gioco alla libreria dell'utente
exports.addGameToLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameId = req.params.gameId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utente non trovato.' });

    if (user.library.includes(gameId)) {
      return res.status(400).json({ message: 'Gioco già presente nella libreria.' });
    }

    user.library.push(gameId);
    await user.save();

    res.json({ message: 'Gioco aggiunto alla libreria.', library: user.library });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiunta del gioco.', error: error.message });
  }
};

// Rimuovi gioco dalla libreria dell'utente
exports.removeGameFromLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameId = req.params.gameId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utente non trovato.' });

    const index = user.library.indexOf(gameId);
    if (index === -1) {
      return res.status(400).json({ message: 'Gioco non presente nella libreria.' });
    }

    user.library.splice(index, 1);
    await user.save();

    res.json({ message: 'Gioco rimosso dalla libreria.', library: user.library });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la rimozione del gioco.', error: error.message });
  }
};
