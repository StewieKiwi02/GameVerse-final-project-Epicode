const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const userController = require('../controllers/userController');
const userAuth = require("../middleware/userAuth");        // Middleware autenticazione user
const adminMiddleware = require('../middleware/adminAuth'); // Middleware admin

const upload = require('../middleware/upload');
const uploadBufferToCloudinary = require('../utils/uploadBufferToCloudinary');
const User = require('../models/User');

// === Rotte Auth classiche ===
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rotte protette da autenticazione userAuth
router.get('/profile', userAuth, userController.getUserProfile);
router.put('/profile', userAuth, userController.updateUserProfile);
router.delete('/profile', userAuth, userController.deleteUser);
router.put('/update-password', userAuth, userController.updateUserPassword);
router.post('/become-admin', userAuth, userController.becomeAdmin);
router.post('/leave-admin', userAuth, userController.leaveAdmin);

// NUOVA ROTTA per la libreria giochi dell'utente
router.get('/library', userAuth, userController.getUserLibrary);
// Aggiungi gioco alla libreria
router.post('/library/:gameId', userAuth, userController.addGameToLibrary);
// Rimuovi gioco dalla libreria
router.delete('/library/:gameId', userAuth, userController.removeGameFromLibrary);

// Rotte per upload immagini utente

// Upload immagine profilo
router.post('/profile-pic', userAuth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File mancante' });

    const result = await uploadBufferToCloudinary(req.file.buffer, 'user_profiles');
    const imageUrl = result.secure_url;

    const user = await User.findByIdAndUpdate(req.user._id, { profilePic: imageUrl }, { new: true });
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    res.json({ message: 'Profile picture aggiornata', profilePic: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore caricamento immagine' });
  }
});

// Upload immagine banner
router.post('/banner', userAuth, upload.single('banner'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File mancante' });

    const result = await uploadBufferToCloudinary(req.file.buffer, 'user_banners');
    const imageUrl = result.secure_url;

    const user = await User.findByIdAndUpdate(req.user._id, { banner: imageUrl }, { new: true });
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    res.json({ message: 'Banner aggiornato', banner: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore caricamento immagine' });
  }
});

// Rotta test
router.get('/test', (req, res) => {
  res.json({ message: 'Rotta utenti OK' });
});

// Rotta per ottenere tutti gli utenti: protetta da autenticazione + admin
router.get('/', userAuth, adminMiddleware, userController.getAllUsers);

// === Google OAuth ===
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  }
);

module.exports = router;
