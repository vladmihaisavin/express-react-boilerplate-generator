const { RELATIVE_PATHS } = require('../helpers/constants')

const actions = ({
  projectName,
  resourceGenerators,
  relativePath,
  fileName
}) => ({
  [RELATIVE_PATHS.SERVER_RESOURCES_CONTROLLER]: () => {
    resourceGenerators.server.generateResourcesControllers(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_RESOURCE_MODEL]: () => {
    resourceGenerators.server.generateResourceModels(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_RESOURCE_REPOSITORY]: () => {
    resourceGenerators.server.generateResourceRepositories(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_RESOURCES_VALIDATOR]: () => {
    resourceGenerators.server.generateResourcesValidators(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_ROUTES]: () => {
    resourceGenerators.server.generateRoutes(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_SCHEMAS]: () => {
    resourceGenerators.server.generateSchemas(relativePath, fileName)
  },
  [RELATIVE_PATHS.SERVER_PACKAGE_JSON]: () => {
    resourceGenerators.server.generatePackageJson(projectName)
  },
  [RELATIVE_PATHS.CLIENT_ROUTES]: () => {
    resourceGenerators.client.generateRoutes(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCES_SECTION]: () => {
    resourceGenerators.client.generateResourcesSections(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCE_FORM_SECTION]: () => {
    resourceGenerators.client.generateResourceFormSections(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_HEADER]: () => {
    resourceGenerators.client.generateHeader(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_NAVIGATOR]: () => {
    resourceGenerators.client.generateNavigator(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCES_SERVICE]: () => {
    resourceGenerators.client.generateResourcesServices(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCE_RESOURCE]: () => {
    resourceGenerators.client.generateResourceResources(relativePath, fileName)
  },
  [RELATIVE_PATHS.CLIENT_PACKAGE_JSON]: () => {
    resourceGenerators.client.generatePackageJson(projectName)
  }
})

module.exports = ({ projectName, resourceGenerators }) =>
  ({ relativePath, fileName }) =>
    actions({
      projectName,
      resourceGenerators,
      relativePath,
      fileName
    })[relativePath]()