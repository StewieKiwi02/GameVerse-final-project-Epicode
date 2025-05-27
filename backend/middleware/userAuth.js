const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Controlla se header Authorization è presente e inizia con "Bearer "
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  try {
    // Estrai "Bearer TOKEN" dall'header
    const token = authHeader.split(' ')[1];

    // Verifica e decodifica il token usando la secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trova l'utente nel db senza la password e lo inserisce in req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};

module.exports = authMiddleware;
