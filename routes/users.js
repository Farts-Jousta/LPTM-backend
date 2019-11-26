// Prerequisites
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Journey = require('../models/Journey');
// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const { ensureAuthenticated } = require('../config/auth')
const passport = require('../config/passport')

// Login Page
router.get('/login', (req, res) => {
  res.redirect('/')
});

// Register Page
router.get('/register', (req, res) => {
  res.redirect('/')
});

// Current User Data ( Including Profile and Journeys )
router.get('/data', async (req, res) => {
  try {
    console.log("Data being collected...")
    console.log("req.user in users/data")
    console.log(req.user)
    if (req.user) {
      const profile = Profile.findOne({userId: req.user._id});
      const journeys = Journey.find({userId: req.user._id});
      res.send({
        status: 200,
        user: req.user,
        profile: profile,
        journeys:journeys
      });
    } else {
      console.log("req.user doesn't exist")
      res.send({status: 404, msg: "No User Signed In"});
    };
  } catch (err) {
    res.status(500).send(err);
  };
});

// Logging In
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.data = {
      status: 400,
      errors: {
        login:[]
      }
    }
    if (info != undefined) {
      req.data.errors.login.push({msg: info.message})
      req.data.status = 400
    }
    req.login(user, (err) => {
      next()
    })
  })(req, res, next)
}, (req, res) => {
  console.log(req.data)
  if (req.user) {
    res.redirect('/')
  } else {
    const userData = { data: req.data }
    res.render('index', userData)
  }
})

// Logging Out
router.post('/logout', (req, res) => {
  req.logout()
});

// Registering
router.post('/register', async (req, res) => {
  console.log("Registering...")
  try {
    console.log("register req.body")
    console.log(req.body)
    const { username, email, password, password2 } = req.body
    const userTaken = await User.findOne({username : username})
    const emailTaken = await User.findOne({email : email})
    const errors = {
      login: [],
      register: [],
      other: []
    }

    // Check username
    if (userTaken) {
      errors.register.push({msg: "That username is taken!"})
    }
    // Check email
    if (emailTaken) {
      errors.register.push({msg: "That email already has an account!"})
    }
    // Check required fields and passwords match
    if (!username || !email || !password || !password2) {
      errors.register.push({msg: 'Please fill in all fields!'})
    } else if (password != password2) {
      errors.register.push({msg:"Passwords do not matc!h"})
    }
    // Check password length
    if (password && (password.length < 6)) {
      errors.register.push({msg: "Password needs to be at least 6 characters!"})
    }
    if(errors.register.length > 0) {
      req.flash('error_msg', 'Obligitory Error Message!');
      res.render('index', { data: {
        status: 400,
        errors,
        username,
        email,
        password,
        password2
      }})
    } else {
      const hashedPassword = await bcrypt.hash(password, 16)
      const savedUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword
      }, function (err) {
        if (err) return handleError(err);
      })
      req.flash('success_msg', 'You are now registered!');
      req.login(savedUser, (err) => {
        next()
      })
    }
  } catch (err) {
    console.log(err)
  }
});

// Seeding Users
router.post('/seed', async (req, res, next) => {
  try{
    await User.deleteMany({})
    await User.insertMany([
      {
        username: "Piggly Wiggly",
        password: await bcrypt.hash("piggly", 16),
        email: "piggly@wiggly.com"
      },
      {
        username: "Soap",
        password: await bcrypt.hash("squeaky", 16),
        email: "squeaky@soap.com"
      },
      {
        username: "Fred",
        password: await bcrypt.hash("Internet", 16),
        email: "annoying@douch.com"
      },
      {
        username: "Filler Name",
        password: await bcrypt.hash("some lie", 16),
        email: "some@email.com"
      }
    ])
    console.log(await User.find({}))
    res.send(await User.find({}))
  }
  catch (err) {
    res.status(500).send(err)
  }
});

module.exports = router