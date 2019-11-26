const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Checking User...")
      const user = await User.findOne({username: username})
      if (!user) { return done(null, false, {message: "Username Not Registered"}) }

      console.log("Checking Password...")
      // If user matches
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) { return done(null, user) }
      else {
        console.log("Password Incorrect")
        return done(null, false, {message: 'Password Incorrect'})
      }
    }
    catch(err) {
      console.log(err)
      console.log("Error Login")
    }
    
  })
)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;