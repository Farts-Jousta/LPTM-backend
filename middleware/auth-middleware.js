// custom middleware to be used on routes that need authentication
const hasAuth = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = hasAuth
