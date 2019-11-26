const passport = require('passport')
const bcrypt = require('bcrypt')

// models
const User = require('../models/User')

const register = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10)
  let user = new User({
    username: req.body.username,
    password: hash,
  })
  await user.save()
  req.login(user, (err) => {
    if (err) {
      return res.status(404).send('error')
    } else {
      return res.send('success')
    }
  })
}

const login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next()
    }
    if (!user) {
      next()
    }
    req.login(user, function(err) {
      if (err) {
        return next()
      }
      next()
    })
  })(req, res, next)
}

const confirmLogin = (req, res) => {
  // here you can redirect based on whether you have a user or not, you don't necessarily need this, it's just nice to check for req.user when using passport
  if (req.user) {
    res.send('success')
  } else {
    res.status(404).send('error')
  }
}

const logout = (req, res) => {
  req.logOut()
  res.send('logged out')
}

module.exports = {
  register,
  login,
  confirmLogin,
  logout,
}
