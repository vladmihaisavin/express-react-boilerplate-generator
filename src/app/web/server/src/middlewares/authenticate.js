  
const passport = require('passport')

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      res.status(500).end()
    } else if (!user) {
      res.status(401).end()
    } else {
      req.currentUser = user
      next()
    }
  })(req, res, next)
}