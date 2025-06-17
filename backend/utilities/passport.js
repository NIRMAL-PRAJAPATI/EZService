const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    console.log(email, name);

    // You can pass these to the callback route via done()
    return done(null, { name, email });
  }
));

passport.serializeUser((user, done) => {
  done(null, user); // stores whole object in session
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
