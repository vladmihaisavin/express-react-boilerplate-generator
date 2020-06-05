module.exports = ({
  hasAuthentication,
  resources,
  fileManager
}) => {
  const {
    readFile,
    writeFile,
    removeLines,
    newLineWithTabs
  } = fileManager

  const generateResourcesControllers = (relativePath) => {}
  const generateResourceModels = (relativePath) => {}
  const generateResourceRepositories = (relativePath) => {}
  const generateResourcesValidators = (relativePath) => {}
  const generateRoutes = (relativePath) => {}
  const generateSchemas = (relativePath) => {}
  const generatePackageJson = (projectName) => {}

  return {
    generateResourcesControllers,
    generateResourceModels,
    generateResourceRepositories,
    generateResourcesValidators,
    generateRoutes,
    generateSchemas,
    generatePackageJson
  }
}