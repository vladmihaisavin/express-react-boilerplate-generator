
const generateSimpleFilterObject = (placeholders, values) => ({
  placeholders: placeholders.reduce((acc, placeholder) => {
    acc.push(`${ placeholder } = ?`)
    return acc
  }, []).join(', '),
  values
})

const prepareResults = (response) => {
  const results = []
  for (const result of JSON.parse(JSON.stringify(response.results))) {
    if (result.createdAt) {
      result.createdAt = moment(results.createdAt).format('YYYY-MM-DDTHH:mm')
    }
    if (result.updatedAt) {
      result.updatedAt = moment(results.updatedAt).format('YYYY-MM-DDTHH:mm')
    }
    results.push(result)
  }
  return results
}

module.exports = {
  generateSimpleFilterObject,
  prepareResults
}