const fs = require('fs')
const path = require('path')
const { removeLines, newLineWithTabs } = require('../helpers/fileFormatting')
const { RELATIVE_PATHS } = require('../helpers/constants')

const actions = ({
  stubsPath,
  outputPath,
  hasAuthentication,
  resourceGenerators,
  relativePath,
  fileName
}) => {
  const readFile = () => fs.readFileSync(path.join(stubsPath, `${relativePath}.stub`), 'utf8')
  const writeFile = (content) => fs.writeFileSync(`${outputPath}/${fileName}`, content, 'utf8')

  return {
    [RELATIVE_PATHS.CLIENT_ROUTES]: () => {
      let content = readFile()
      const LoginComponentImport = `import Login from './components/pages/Login.jsx'`
      const LoginComponentCall = `<Route path="/login" component={Login} />`
      if (hasAuthentication) {
        content = content.replace(/###LoginComponentImport###/g, LoginComponentImport)
        content = content.replace(/###LoginComponentCall###/g, LoginComponentCall)
      } else {
        content = removeLines(content, [6, 26])
      }
      const routeType = hasAuthentication ? 'ProtectedRoute' : 'Route'
      const DashboardComponentCall = `<${routeType} exact path="/dashboard" component={withLayout(Dashboard)} />`
      content = content.replace(/###DashboardComponentCall###/g, DashboardComponentCall)
    },
    [RELATIVE_PATHS.CLIENT_RESOURCES_SECTION]: () => {
      resourceGenerators.client.generateResourcesSections(relativePath)
    },
    [RELATIVE_PATHS.CLIENT_RESOURCE_FORM_SECTION]: () => {
      resourceGenerators.client.generateResourceFormSections(relativePath)
    },
    [RELATIVE_PATHS.CLIENT_HEADER]: () => {
      let content = readFile()
      const AvatarMenuComponentImport = `import AvatarMenu from './AvatarMenu.jsx'`
      const AvatarMenuComponentCall = `<Grid item>${newLineWithTabs(7)}<AvatarMenu />${newLineWithTabs(6)}</Grid>`
      if (hasAuthentication) {
        content = content.replace(/###AvatarMenuComponentImport###/g, AvatarMenuComponentImport)
        content = content.replace(/###AvatarMenuComponentCall###/g, AvatarMenuComponentCall)
      } else {
        content = removeLines(content, [12, 46])
      }
      writeFile(content)
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
  }
}

module.exports = (options) => 
  ({ relativePath, fileName }) => 
    actions({ 
      ...options,
      relativePath,
      fileName
    })[options.relativePath]()