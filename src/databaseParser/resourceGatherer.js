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
    const keyColumnUsages = (await dbClient.query(`SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='${table}'`)).results
    const resourceInformation = {
      tableName: table,
      resourceSingular: pluralize.singular(camelCase(table)),
      resourcePlural: pluralize.plural(camelCase(table)),
      ResourceSingular: pluralize.singular(camelCase(table, {pascalCase: true})),
      ResourcePlural: pluralize.plural(camelCase(table, {pascalCase: true})),
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
            referencedTableName: keyColumnUsage[0].REFERENCED_TABLE_NAME,
            referencedColumnName: keyColumnUsage[0].REFERENCED_COLUMN_NAME
          }
        }
        foreignKeyNo++
      }
      resourceInformation.fields.push(field)
    }
    if (foreignKeyNo === 2) {
      resourceInformation.tableType = 'pivot'
    } else if (foreignKeyNo === 0) {
      resourceInformation.tableType = 'normal'
    } else {
      resourceInformation.tableType = 'connected'
    }
    resources.push(resourceInformation)
  }
  
  return resources
}