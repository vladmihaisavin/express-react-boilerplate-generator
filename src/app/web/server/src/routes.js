const { Router } = require('express')
const { version } = require('../../../../../output/server/package.json')

module.exports = ({ config, repositories }) => {
  const app = new Router()

  app.get('/info', (req, res) => {
    res.json({ version })
  })
  //e.g. app.use('/path', ...middlewares, controller({ config, resourceRepository}))

  return app
}