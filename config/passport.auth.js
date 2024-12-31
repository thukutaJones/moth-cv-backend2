const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLe_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const payload = {
          fullName: profile.displayName,
          email: profile.emails[0].value,
          profilePhoto: profile.photos[0]?.value,
        };

        let user = await User.findOne({ email: payload.email });

        if (!user) {
          user = await User.create(payload);
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport || null;
