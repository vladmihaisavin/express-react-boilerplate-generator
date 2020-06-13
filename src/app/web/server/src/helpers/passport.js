const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')

module.exports = ({ config, passport, repositories }) => {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = config.get('auth.secret')
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    let user
    try {
      user = await repositories.user.getByEmail(jwt_payload.email)
      if (!user) {
        return done(null, false, { message: 'Invalid email' })
      }
    }
    catch (e) {
      return done(e)
    }
    return done(null, user)
  }))
}