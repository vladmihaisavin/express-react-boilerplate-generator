const camelCase = require('camelcase')
const pluralize = require('pluralize')

module.exports = (dbClient) => async () => {
  const getTableNames = async (dbClient) => {
    return (await dbClient.listTables())
      .results
      .reduce((acc, result) => { 
        acc.push(result.Tables_in_test_db)
        return acc
      }, [])
  }

  const tables = await getTableNames(dbClient)
  const resources = []

  for (const table of tables) {
    const description = (await dbClient.describeTable(table)).results
    const resourceInformation = {
      tableName: table,
      resourceSingular: pluralize.singular(camelCase(table)),
      resourcePlural: pluralize.plural(camelCase(table)),
      ResourceSingular: pluralize.singular(camelCase(table, {pascalCase: true})),
      ResourcePlural: pluralize.plural(camelCase(table, {pascalCase: true})),
      fields: []
    }
    for (const RowDataPacket of description) {
      resourceInformation.fields.push({
        name: RowDataPacket.Field,
        type: RowDataPacket.Type,
        nullable: RowDataPacket.Null === 'YES',
        key: RowDataPacket.Key,
        default: RowDataPacket.Default,
        extra: RowDataPacket.Extra
      })
    }
    resources.push(resourceInformation)
  }
  
  return resources
}