const { Router } = require('express')
const { version } = require('../package.json')
###ResourceControllerImports###

  const app = new Router()

  app.get('/info', (req, res) => {
    res.json({ version })
  })
  //e.g. app.use('/path', ...middlewares, controller({ config, resourceRepository}))
###ResourceRoutes###

  return app