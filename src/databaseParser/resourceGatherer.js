const camelCase = require('camelcase')
const decamelize = require('decamelize')
const pluralize = require('pluralize')

const generateTableResourceNames = (tableName) => ({
  tableName,
  resourceSlug: decamelize(pluralize.plural(camelCase(tableName)), '-'),
  resourceSingular: pluralize.singular(camelCase(tableName)),
  resourcePlural: pluralize.plural(camelCase(tableName)),
  ResourceSingular: pluralize.singular(camelCase(tableName, {pascalCase: true})),
  ResourcePlural: pluralize.plural(camelCase(tableName, {pascalCase: true}))
})

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
    const keyColumnUsages = (await dbClient.query(`SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='${table}'`)).results
    const resourceInformation = {
      ...generateTableResourceNames(table),
      fields: []
    }
    let foreignKeyNo = 0
    for (const RowDataPacket of description) {
      const field = {
        name: RowDataPacket.Field,
        type: RowDataPacket.Type,
        nullable: RowDataPacket.Null === 'YES',
        key: RowDataPacket.Key,
        default: RowDataPacket.Default,
        extra: RowDataPacket.Extra
      }
      if (field.key === 'MUL') {
        keyColumnUsage = keyColumnUsages.filter(item => item.COLUMN_NAME === field.name)
        if (keyColumnUsage.length > 0) {
          field.foreignKeyDetails = {
            ...generateTableResourceNames(keyColumnUsage[0].REFERENCED_TABLE_NAME),
            columnName: keyColumnUsage[0].REFERENCED_COLUMN_NAME
          }
        }
        foreignKeyNo++
      }
      resourceInformation.fields.push(field)
    }
    if (foreignKeyNo === 2) {
      resourceInformation.tableType = 'pivot'
      resourceInformation.resourceSingular = resourceInformation.resourcePlural
      resourceInformation.ResourceSingular = resourceInformation.ResourcePlural
    } else if (foreignKeyNo === 0) {
      resourceInformation.tableType = 'normal'
    } else {
      resourceInformation.tableType = 'connected'
    }
    resources.push(resourceInformation)
  }
  
  return resources
}