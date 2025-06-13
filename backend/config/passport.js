const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerca utente già esistente con googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Genera username base (es: nome.cognome o da email)
        const email = profile.emails?.[0]?.value || '';
        const baseUsername = email ? email.split('@')[0] : `${profile.name.givenName}${profile.name.familyName}`.toLowerCase();

        // Evita duplicati nel campo username
        let uniqueUsername = baseUsername;
        let suffix = 1;
        while (await User.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${baseUsername}${suffix}`;
          suffix++;
        }

        // Crea nuovo utente
        user = await User.create({
          googleId: profile.id,
          name: profile.name?.givenName || '',
          surname: profile.name?.familyName || '',
          email: email,
          profilePic: profile.photos?.[0]?.value || '',
          username: uniqueUsername,
          password: '', // campo vuoto, se gestito come opzionale nel model
        });

        return done(null, user);
      } catch (err) {
        console.error("Errore durante autenticazione Google:", err);
        return done(err, false);
      }
    }
  )
);
