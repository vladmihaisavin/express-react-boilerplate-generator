
const extractFieldName = field => field.name
const isNormalField = field => !field.key
const requiredFieldsRule = field => field.nullable === false && isNormalField(field)
const optionalFieldsRule = field => field.nullable && isNormalField(field)

module.exports = {
  extractFieldName,
  isNormalField,
  requiredFieldsRule,
  optionalFieldsRule
}