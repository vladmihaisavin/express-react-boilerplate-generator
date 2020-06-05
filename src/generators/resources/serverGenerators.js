module.exports = ({
  projectName,
  hasAuthentication,
  resources,
  fileManager
}) => {
  const {
    readFile,
    writeFile
  } = fileManager

  const generateResourcesControllers = (relativePath) => {
    const resourcesControllerStubContent = readFile(relativePath.replace('users.js', 'resourcesController.js'))
    resources.forEach(resource => {
      let content = resourcesControllerStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      
      writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
    })
  }

  const generateResourceModels = (relativePath) => {
    
  }
  const generateResourceRepositories = (relativePath) => {}
  const generateResourcesValidators = (relativePath) => {}
  const generateRoutes = (relativePath) => {}
  const generateSchemas = (relativePath) => {}

  const generatePackageJson = (relativePath) => {
    let content = readFile(relativePath)
    writeFile(relativePath, content.replace(/###projectName###/g, projectName))
  }

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