const { RELATIVE_PATHS } = require('../helpers/constants')

const actions = ({
  resourceGenerators,
  relativePath
}) => ({
  [RELATIVE_PATHS.SERVER_RESOURCES_CONTROLLER]: () => {
    resourceGenerators.server.generateResourcesControllers(relativePath)
  },
  [RELATIVE_PATHS.SERVER_RESOURCE_MODEL]: () => {
    resourceGenerators.server.generateResourceModels(relativePath)
  },
  [RELATIVE_PATHS.SERVER_RESOURCE_REPOSITORY]: () => {
    resourceGenerators.server.generateResourceRepositories(relativePath)
  },
  [RELATIVE_PATHS.SERVER_RESOURCES_VALIDATOR]: () => {
    resourceGenerators.server.generateResourcesValidators(relativePath)
  },
  [RELATIVE_PATHS.SERVER_ROUTES]: () => {
    resourceGenerators.server.generateRoutes(relativePath)
  },
  [RELATIVE_PATHS.SERVER_SCHEMAS]: () => {
    resourceGenerators.server.generateSchemas(relativePath)
  },
  [RELATIVE_PATHS.SERVER_PACKAGE_JSON]: () => {
    resourceGenerators.server.generatePackageJson(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_ROUTES]: () => {
    resourceGenerators.client.generateRoutes(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCES_SECTION]: () => {
    resourceGenerators.client.generateResourcesSections(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCE_FORM_SECTION]: () => {
    resourceGenerators.client.generateResourceFormSections(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_HEADER]: () => {
    resourceGenerators.client.generateHeader(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_NAVIGATOR]: () => {
    resourceGenerators.client.generateNavigator(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCES_SERVICE]: () => {
    resourceGenerators.client.generateResourcesServices(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_RESOURCE_RESOURCE]: () => {
    resourceGenerators.client.generateResourceResources(relativePath)
  },
  [RELATIVE_PATHS.CLIENT_PACKAGE_JSON]: () => {
    resourceGenerators.client.generatePackageJson(relativePath)
  }
})

module.exports = ({ resourceGenerators }) =>
  ({ relativePath }) =>
    actions({
      resourceGenerators,
      relativePath
    })[relativePath]()