const os = require('os')
const camelCase = require('camelcase')
const { addTabs, newLineWithTabs, removeLines } = require('../../helpers/fileFormatting')
const {
  extractFieldName,
  requiredFieldsRule,
  optionalFieldsRule
} = require('./commonMethods')

module.exports = ({
  projectName,
  hasAuthentication,
  resources,
  fileManager
}) => {
  const {
    readStub,
    writeFile
  } = fileManager

  const generateRoutes = (relativePath) => {
    let content = readStub(relativePath)

    const LoginComponentImport = `import Login from './components/pages/Login.jsx'`
    const LoginComponentCall = `${addTabs(3)}<Route path="/login" component={Login} />`
    if (hasAuthentication) {
      content = content.replace(/###LoginComponentImport###/g, LoginComponentImport)
      content = content.replace(/###LoginComponentCall###/g, LoginComponentCall)
    } else {
      content = removeLines(content, [5, 6, 22])
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
      const ResourceEditRoute = `${addTabs(3)}<${routeType} exact path="/${resource.resourcePlural}/edit/:${resource.resourceSingular}Id" component={withLayout(${resource.ResourceSingular}Form)} action='update' />`
      return `${ResourceListRoute}${os.EOL}${ResourceNewRoute}${os.EOL}${ResourceEditRoute}`
    }).join(os.EOL)
    content = content.replace(/###ResourceRoutes###/g, ResourceRoutes)

    writeFile(relativePath, content)
  }

  const generateResourcesSections = (relativePath) => {
    const resourcesSectionStubContent = readStub(relativePath.replace('Users.jsx', 'Resources.jsx'))
    resources.forEach(resource => {
      let content = resourcesSectionStubContent.replace(/###ResourcePlural###/g, resource.ResourcePlural)
      content = content.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      
      writeFile(relativePath.replace('Users.jsx', `${resource.ResourcePlural}.jsx`), content)
    })
  }

  const generateResourceFormSections = (relativePath) => {
    const resourceFormSectionStubContent = readStub(relativePath.replace('UserForm.jsx', 'ResourceForm.jsx'))
    resources.forEach(resource => {
      let content = resourceFormSectionStubContent.replace(/###ResourceSingular###/g, resource.ResourceSingular)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      content = content.replace(/###resourcePlural###/g, resource.resourcePlural)
      
      writeFile(relativePath.replace('UserForm.jsx', `${resource.ResourceSingular}Form.jsx`), content)
    })
  }

  const generateHeader = (relativePath) => {
    let content = readStub(relativePath)

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

  const generateNavigator = (relativePath) => {
    let content = readStub(relativePath)

    if (resources.length > 0) {
      const ResourceObjects = resources.map(resource => {
        return `${addTabs(3)}{ id: '${resource.ResourcePlural}', icon: <PeopleIcon />, active: true, url: '/${resource.resourcePlural}' }`
      }).join(`,${os.EOL}`)
      content = content.replace(/###ResourceObjects###/g, ResourceObjects)
    } else {
      content = removeLines(content, [12, 19])
    }
    content = content.replace(/###ProjectName###/g, projectName)

    writeFile(relativePath, content)
  }

  const generateResourcesServices = (relativePath) => {
    const resourcesServiceStubContent = readStub(relativePath.replace('users.js', 'resources.js'))
    resources.forEach(resource => {
      let content = resourcesServiceStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      
      writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
    })
  }

  const generateResourceResources = (relativePath) => {
    resources.forEach(resource => {
      const requiredFields = resource.fields.filter(requiredFieldsRule)
      const optionalFields = resource.fields.filter(optionalFieldsRule)
      const fillableFields = requiredFields.concat(optionalFields)
      const resourceObject = {
        resourceName: resource.resourceSingular,
        resourceUrl: resource.resourcePlural,
        listProperties: fillableFields.map((field, idx) => {
          const properties = {
            id: field.name,
            label: camelCase(field.name, {pascalCase: true}),
            disablePadding: idx === 0,
            numeric: field.type === 'int'
          }
          if (field.name.includes('date') || field.type === 'timestamp') {
            properties.type = 'datetime-local'
          }
          return properties
        }),
        formProperties: fillableFields.map(field => {
          const properties = {
            id: field.name,
            label: camelCase(field.name, {pascalCase: true})
          }
          if (field.name.includes('password')) {
            properties.type = 'password'
          }
          if (field.name.includes('date') || field.type === 'timestamp') {
            properties.type = 'datetime-local'
          }
          return properties
        }),
        formFields: fillableFields.map(extractFieldName)
      }

      writeFile(relativePath.replace('userResource.json', `${resource.resourceSingular}Resource.json`), JSON.stringify(resourceObject))
    })
  }

  const generatePackageJson = (relativePath) => {
    let content = readStub(relativePath)
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