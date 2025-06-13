// carichiamo variabili dal file .env
const dotenv = require('dotenv');
dotenv.config();

// importiamo le principali librerie
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');             
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const platformRoutes = require('./routes/platformRoutes');
const languageRoutes = require('./routes/languageRoutes');
const gameRoutes = require('./routes/gameRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const emailRoutes = require('./routes/emailRoutes');
const commentRoutes = require('./routes/commentRoutes');
require('./config/passport');

// inizializziamo express
const app = express();

// connetti al database
connectDB();

// CORS: configurazione esplicita
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // <-- cambia con l'URL frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // se usi cookie/sessioni, altrimenti false
};

app.use(cors(corsOptions));

// middleware base
app.use(express.json()); // permette di leggere file json nel body 

// sessione necessaria per OAuth temporaneamente (solo per Google callback)
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// inizializza passport
app.use(passport.initialize());
app.use(passport.session()); // solo se usi sessioni (temporaneo per callback OAuth)

// ** SERVE FILES STATICI DA public **
app.use(express.static(path.join(__dirname, 'public')));

// rotte
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/upload', uploadRouter);
app.use('/api/email', emailRoutes);
app.use('/api/comments', commentRoutes);

// rotta test
app.get('/', (req, res) => {
  res.send('API GameVerse è attiva!');
});

// importo porta del server
const PORT = process.env.PORT || 5000;

// avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
