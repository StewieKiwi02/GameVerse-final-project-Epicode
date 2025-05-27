const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRAZIONE
exports.registerUser = async (req, res) => {
  try {
    const { name, surname, username, email, password, birthDate, phone } = req.body;

    if (!name || !surname || !username || !email || !password || !birthDate) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati.' });
    }

    // Validazione data in formato italiano gg/mm/aaaa
    const italianDate = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/;
    if (!italianDate.test(birthDate)) {
      return res.status(400).json({ message: 'La data di nascita deve essere nel formato gg/mm/aaaa.' });
    }

    const [day, month, year] = birthDate.split('/');
    const formattedBirthDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(formattedBirthDate.getTime())) {
      return res.status(400).json({ message: 'Data di nascita non valida.' });
    }

    // Controllo unicità email e username
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
