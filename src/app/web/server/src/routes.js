const { Router } = require('express')
const { version } = require('../package.json')
const createDatabaseParser = require('../../../../databaseParser')

module.exports = ({ config }) => {
  const app = new Router()

  app.get('/info', (req, res) => {
    res.json({ version })
  })
  app.post('/resources', async (req, res) => {
    const { databaseType, ...dbCredentials } = req.body
    try {
      const databaseParser = await createDatabaseParser({
        connectionData: dbCredentials,
        type: databaseType
      })
      resources = await databaseParser.gatherResources()
      return res.status(200).json(resources)
    } catch (err) {
      return res.status(500).json(err)
    }
  })

  return app
}