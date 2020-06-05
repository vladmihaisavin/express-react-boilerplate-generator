module.exports = ({
  projectName,
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

  const generateRoutes = (relativePath) => {
    let content = readFile(relativePath)

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