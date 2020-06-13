const { Router } = require('express')
const validate = require('express-validation')
const validationRules = require('../validation/authentication')
const { comparePassword } = require('../helpers/bcrypt')
const jwt = require('jsonwebtoken')

module.exports = ({ config, userRepository }) => {
  const app = new Router()

  app.post('/register', validate(validationRules.register), async (req, res) => {
    try {
      const results = (await userRepository.store(req.body))
      return res.status(201).json({ id: results.insertId })
    } catch (err) {
      console.error(`Register failed. Reason: ${ err }`)
      return res.sendStatus(500)
    }
  })

  app.post('/login', validate(validationRules.login), async (req, res) => {
    try {
      let results = await userRepository.getByEmail(req.body.email)
      if (results.length === 0) {
        console.info('Request forbidden. Reason: user not found.')
        return res.sendStatus(403)
      }
      const user = results[0]
      const passwordMatch = await comparePassword(req.body.password, user.password)
      if (!passwordMatch) {
        console.info('Request forbidden. Reason: user password does not match.')
        return res.sendStatus(403)
      }
      const token = await jwt.sign(user, config.get('auth.secret'), {
        expiresIn: config.get('auth.expiresIn')
      })
      return res.status(200).json({ user, token })
    } catch (err) {
      console.error(`Login failed. Reason: ${ err }`)
      return res.sendStatus(500)
    }
  })

  return app
}