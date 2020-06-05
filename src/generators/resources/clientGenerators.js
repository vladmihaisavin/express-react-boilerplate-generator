const fs = require('fs')

module.exports = (resources, { stubsPath, outputPath }) => {
  const generateResourcesSections = (relativePath) => {}
  const generateResourceFormSections = (relativePath) => {}
  const generateNavigator = (relativePath) => {}
  const generateResourcesServices = (relativePath) => {}

  return {
    generateResourcesSections,
    generateResourceFormSections,
    generateNavigator,
    generateResourcesServices
  }
}