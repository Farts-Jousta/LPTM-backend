const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

// mongoose
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect('add your db string', dbOptions, (err) => {
  if (err) {
    console.log('not connected ❌')
  } else {
    console.log('connected ✅')
  }
})

// express session
app.use(
  session({
    secret: 'your session secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }),
)

// passport
const passport = require('./initializers/passport')
app.use(passport.initialize())
app.use(passport.session())

// require all routes
app.use(require('./routes'))

app.listen(PORT, () => console.log('listening on port 5000'))
