const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../routes/user'); // Ensure you have a User model

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
