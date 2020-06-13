const createMysqlClient = require('mysql-node-client')
const schemas = require('./schemas.json')
const seeders = require('./seeders')

const getSchemaTableNames = () => {
  return schemas.reduce((acc, schema) => { 
    acc.push(schema.tableName)
    return acc
  }, [])
}

const getExistingTableNames = async (mysqlClient) => {
  return (await mysqlClient.listTables())
    .results
    .reduce((acc, result) => { 
      acc.push(result.Tables_in_test_db)
      return acc
    }, [])
}

const checkDatabaseStatus = (mysqlClient) => new Promise(async (resolve, reject) => {
  try {
    const existingTableNames = await getExistingTableNames(mysqlClient)
    const schemaTableNames = getSchemaTableNames()
    const missingTables = []
    for (const tableName of schemaTableNames) {
      if (!existingTableNames.includes(tableName)) {
        missingTables.push(tableName)
      }
    }
    if (missingTables.length > 0) {
      console.log(`The following tables are missing from the database: ${ missingTables.join(',') }`)
      resolve(missingTables)
    }
    resolve()
  } catch (err) {
    reject(err)
  }
})

const createTables = async (mysqlClient, missingTables) => {
  for (const schema of schemas) {
    if (missingTables.includes(schema.tableName)) {
      await mysqlClient.createTable(schema.tableName, schema.tableSchema)
    }
  }
}

const seedTables = async (mysqlClient, missingTables) => {
  const seedRecords = await seeders()
  for (const seeder of seedRecords) {
    if (missingTables.includes(seeder.tableName)) {
      await mysqlClient.store(seeder.tableName, seeder.record)
    }
  }
}

const setupDatabase = async (mysqlClient, missingTables) => {
  console.log('Creating and populating the missing tables...')
  await createTables(mysqlClient, missingTables)
  await seedTables(mysqlClient, missingTables)
}

module.exports = (config) => new Promise(async (resolve, reject) => {
  const CONNECTION_DATA = {
    host: config.get('mysql.host'),
    port: config.get('mysql.port'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database')
  }
  const mysqlClient = createMysqlClient(CONNECTION_DATA)

  await checkDatabaseStatus(mysqlClient)
    .then(async (missingTables) => {
      if (missingTables) {
        await setupDatabase(mysqlClient, missingTables)
          .catch(err => reject(err))
      }
    })
    .catch((err) => {
      reject(err)
    })
    .finally(() => {
      resolve(mysqlClient)
    })
})
