const os = require('os')
const { addTabs, newLineWithTabs, removeLines } = require('../../helpers/fileFormatting')

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

  const generateRoutes = (relativePath) => {
    let content = readFile(relativePath)

    const LoginComponentImport = `import Login from './components/pages/Login.jsx'`
    const LoginComponentCall = `${addTabs(3)}<Route path="/login" component={Login} />`
    if (hasAuthentication) {
      content = content.replace(/###LoginComponentImport###/g, LoginComponentImport)
      content = content.replace(/###LoginComponentCall###/g, LoginComponentCall)
    } else {
      content = removeLines(content, [5, 6, 26])
    }
    
    const routeType = hasAuthentication ? 'ProtectedRoute' : 'Route'
    const DashboardComponentCall = `${addTabs(3)}<${routeType} exact path="/dashboard" component={withLayout(Dashboard)} />`
    content = content.replace(/###DashboardComponentCall###/g, DashboardComponentCall)

    const ResourceComponentsImport = resources.map(resource => {
      const ResourcesComponentImport = `import ${resource.ResourcePlural} from './components/sections/${resource.ResourcePlural}.jsx'`
      const ResourceFormImport = `import ${resource.ResourceSingular}Form from './components/sections/${resource.ResourceSingular}Form.jsx'`
      return `${ResourcesComponentImport}${os.EOL}${ResourceFormImport}`
    }).join(os.EOL)
    content = content.replace(/###ResourceComponentsImport###/g, ResourceComponentsImport)

    const ResourceRoutes = resources.map(resource => {
      const ResourceListRoute = `${addTabs(3)}<${routeType} exact path="/${resource.resourcePlural}" component={withLayout(${resource.ResourcePlural})} />`
      const ResourceNewRoute = `${addTabs(3)}<${routeType} exact path="/${resource.resourcePlural}/new" component={withLayout(${resource.ResourceSingular}Form)} action='create' />`
      const ResourceEditRoute = `${addTabs(3)}<${routeType} exact path="/${resource.resourcePlural}/edit/:userId" component={withLayout(${resource.ResourceSingular}Form)} action='update' />`
      return `${ResourceListRoute}${os.EOL}${ResourceNewRoute}${os.EOL}${ResourceEditRoute}`
    }).join(os.EOL)
    content = content.replace(/###ResourceRoutes###/g, ResourceRoutes)

    writeFile(relativePath, content)
  }

  const generateResourcesSections = (relativePath) => {}
  const generateResourceFormSections = (relativePath) => {}

  const generateHeader = (relativePath) => {
    let content = readFile(relativePath)

    const AvatarMenuComponentImport = `import AvatarMenu from './AvatarMenu.jsx'`
    const AvatarMenuComponentCall = `<Grid item>${newLineWithTabs(7)}<AvatarMenu />${newLineWithTabs(6)}</Grid>`
    if (hasAuthentication) {
      content = content.replace(/###AvatarMenuComponentImport###/g, AvatarMenuComponentImport)
      content = content.replace(/###AvatarMenuComponentCall###/g, AvatarMenuComponentCall)
    } else {
      content = removeLines(content, [12, 46])
    }

    writeFile(relativePath, content)
  }

  const generateNavigator = (relativePath) => {}
  const generateResourcesServices = (relativePath) => {}
  const generateResourceResources = (relativePath) => {}

  const generatePackageJson = (relativePath) => {
    let content = readFile(relativePath)
    writeFile(relativePath, content.replace(/###projectName###/g, projectName))
  }

  return {
    generateRoutes,
    generateResourcesSections,
    generateResourceFormSections,
    generateHeader,
    generateNavigator,
    generateResourcesServices,
    generateResourceResources,
    generatePackageJson
  }
}