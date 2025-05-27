const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/userAuth');
const adminMiddleware = require('../middleware/adminAuth');

// === Rotte Auth classiche ===
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.delete('/profile', authMiddleware, userController.deleteUser);
router.put('/update-password', authMiddleware, userController.updateUserPassword);

router.get('/test', (req, res) => {
  res.json({ message: 'Rotta utenti OK' });
});

// --- Nuova rotta per ottenere tutti gli utenti (solo admin) ---
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

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
