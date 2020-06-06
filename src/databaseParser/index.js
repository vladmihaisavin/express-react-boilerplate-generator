const createMysqlClient = require('mysql-node-client')
const createResourceGatherer = require('./resourceGatherer')

module.exports = async (databaseOptions) => {
  let dbClient = {}

  if (databaseOptions.type === 'mysql') {
    dbClient = createMysqlClient(databaseOptions.connectionData)
  }
  return {
    gatherResources: createResourceGatherer(dbClient)
  }
}