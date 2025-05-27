const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
          username: profile.emails[0].value.split('@')[0],
          password: '',
        });

        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
