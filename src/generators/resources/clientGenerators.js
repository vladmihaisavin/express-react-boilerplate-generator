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
  const generateRoutes = (relativePath, fileName) => {
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

    writeFile(fileName, content)
  }

  const generateResourcesSections = (relativePath, fileName) => {}
  const generateResourceFormSections = (relativePath, fileName) => {}

  const generateHeader = (relativePath, fileName) => {
    let content = readFile(relativePath)

    const AvatarMenuComponentImport = `import AvatarMenu from './AvatarMenu.jsx'`
    const AvatarMenuComponentCall = `<Grid item>${newLineWithTabs(7)}<AvatarMenu />${newLineWithTabs(6)}</Grid>`
    if (hasAuthentication) {
      content = content.replace(/###AvatarMenuComponentImport###/g, AvatarMenuComponentImport)
      content = content.replace(/###AvatarMenuComponentCall###/g, AvatarMenuComponentCall)
    } else {
      content = removeLines(content, [12, 46])
    }
    
    writeFile(fileName, content)
  }

  const generateNavigator = (relativePath, fileName) => {}
  const generateResourcesServices = (relativePath, fileName) => {}
  const generateResourceResources = (relativePath, fileName) => {}
  const generatePackageJson = (projectName) => {}

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