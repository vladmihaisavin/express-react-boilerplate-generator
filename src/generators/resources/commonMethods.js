
const extractFieldName = field => field.name
const isFillableField = field => !field.key || field.key === 'MUL'
const requiredFieldsRule = field => field.nullable === false && isFillableField(field)
const optionalFieldsRule = field => field.nullable && isFillableField(field)

module.exports = {
  extractFieldName,
  isFillableField,
  requiredFieldsRule,
  optionalFieldsRule
}