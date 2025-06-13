const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica presenza dell'header Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Accesso rifiutato: header Authorization mancante o malformato.');
    return res.status(401).json({ message: 'Token mancante o non valido' });
  }

  // Controlla che la JWT_SECRET sia impostata
  if (!process.env.JWT_SECRET) {
    console.error('Errore server: JWT_SECRET non definito nelle variabili d’ambiente.');
    return res.status(500).json({ message: 'Configurazione server non valida' });
  }

  try {
    const token = authHeader.split(' ')[1];

    // Verifica e decodifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Recupera l'utente dal DB senza la password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn(`Accesso rifiutato: utente con ID ${decoded.id} non trovato.`);
      return res.status(401).json({ message: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Errore durante la verifica del token JWT:', error.message);
    return res.status(401).json({ message: 'Token non valido o scaduto' });
  }
};

module.exports = authMiddleware;
