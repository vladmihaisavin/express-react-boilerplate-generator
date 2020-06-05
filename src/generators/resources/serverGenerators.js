module.exports = (
  hasAuthentication,
  resources,
  {
    readFile,
    writeFile,
    removeLines,
    newLineWithTabs
  }
) => {
  const generateResourcesController = (relativePath, fileName) => {}
  const generateResourceModels = (relativePath, fileName) => {}
  const generateResourceRepositories = (relativePath, fileName) => {}
  const generateResourcesValidators = (relativePath, fileName) => {}
  const generateRoutes = (relativePath, fileName) => {}
  const generateSchemas = (relativePath, fileName) => {}
  const generatePackageJson = (projectName) => {}

  return {
    generateResourcesController,
    generateResourceModels,
    generateResourceRepositories,
    generateResourcesValidators,
    generateRoutes,
    generateSchemas,
    generatePackageJson
  }
}