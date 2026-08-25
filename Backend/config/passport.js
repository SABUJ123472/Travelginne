const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { getIsConnected } = require('./db');

// In-memory Google users fallback (when DB not connected)
const memoryGoogleUsers = [];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;
        const googleId = profile.id;

        const isConnected = getIsConnected();

        if (isConnected) {
          // Try to find existing user by googleId or email
          let user = await User.findOne({ $or: [{ googleId }, { email }] });

          if (!user) {
            // Create new user from Google profile
            user = await User.create({
              name,
              email,
              googleId,
              avatar,
              authProvider: 'google',
              password: 'google_oauth_no_password',
              travelStyle: ['Culture', 'History'],
              preferredBudget: 'Moderate',
            });
            console.log(`✅ New Google user created: ${email}`);
          } else if (!user.googleId) {
            // Link Google ID to existing email account
            user.googleId = googleId;
            user.avatar = avatar;
            user.authProvider = 'google';
            await user.save();
            console.log(`🔗 Linked Google account to existing user: ${email}`);
          }

          return done(null, user);
        } else {
          // Memory fallback
          let user = memoryGoogleUsers.find(u => u.googleId === googleId || u.email === email);
          if (!user) {
            user = {
              _id: 'google_' + googleId,
              name,
              email,
              googleId,
              avatar,
              authProvider: 'google',
              travelStyle: ['Culture', 'History'],
              preferredBudget: 'Moderate',
              geniePoints: 350,
              travelerRank: 'Silver Voyager',
            };
            memoryGoogleUsers.push(user);
          }
          return done(null, user);
        }
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);

// Minimal serialization (not used since we use JWT, not sessions)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => done(null, { id }));

module.exports = passport;
