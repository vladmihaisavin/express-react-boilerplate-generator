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
      const ResourceListRoute = `${addTabs(3)}<${routeType} exact path="/${resource.resourceSlug}" component={withLayout(${resource.ResourcePlural})} />`
      const ResourceNewRoute = `${os.EOL}${addTabs(3)}<${routeType} exact path="/${resource.resourceSlug}/new" component={withLayout(${resource.ResourceSingular}Form)} action='create' />`
      const ResourceEditRoute = resource.tableType !== 'pivot'
        ? `${os.EOL}${addTabs(3)}<${routeType} exact path="/${resource.resourceSlug}/edit/:${resource.resourceSingular}Id" component={withLayout(${resource.ResourceSingular}Form)} action='update' />`
        : ''
      return `${ResourceListRoute}${ResourceNewRoute}${ResourceEditRoute}`
    }).join(os.EOL)
    content = content.replace(/###ResourceRoutes###/g, ResourceRoutes)

    writeFile(relativePath, content)
  }

  const generateResourcesSections = (relativePath) => {
    const resourcesSectionStubContent = readStub(relativePath.replace('Users.jsx', 'Resources.jsx'))
    const mmResourcesSectionStubContent = readStub(relativePath.replace('Users.jsx', 'mmResources.jsx'))
    resources.forEach(resource => {
      let content
      if (resource.tableType === 'pivot') {
        content = mmResourcesSectionStubContent
        resource.fields.forEach((field, idx) => {
          if (field.key === 'MUL') {
            content = content.replace(new RegExp(`###referencedResourceSingular${ idx }###`, 'g'), field.foreignKeyDetails.resourceSingular)
          }
        })
      } else {
        content = resourcesSectionStubContent
      }

      content = content.replace(/###ResourcePlural###/g, resource.ResourcePlural)
      content = content.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)

      writeFile(relativePath.replace('Users.jsx', `${resource.ResourcePlural}.jsx`), content)
    })
  }

  const generateResourceFormSections = (relativePath) => {
    const resourceFormSectionStubContent = readStub(relativePath.replace('UserForm.jsx', 'ResourceForm.jsx'))
    const mmResourceFormSectionStubContent = readStub(relativePath.replace('UserForm.jsx', 'mmResourceForm.jsx'))
    resources.forEach(resource => {
      let content
      if (resource.tableType === 'pivot') {
        content = mmResourceFormSectionStubContent
        resource.fields.forEach((field, idx) => {
          if (field.key === 'MUL') {
            content = content.replace(new RegExp(`###referencedResourceSingular${ idx }###`, 'g'), field.foreignKeyDetails.resourceSingular)
          }
        })
      } else {
        content = resourceFormSectionStubContent
      }

      content = content.replace(/###ResourceSingular###/g, resource.ResourceSingular)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      content = content.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSlug###/g, resource.resourceSlug)
      
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
        return `${addTabs(3)}{ id: '${resource.ResourcePlural}', icon: <PeopleIcon />, active: true, url: '/${resource.resourceSlug}' }`
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
    const mmResourcesServiceStubContent = readStub(relativePath.replace('users.js', 'mmResources.js'))
    resources.forEach(resource => {
      let content
      if (resource.tableType === 'pivot') {
        content = mmResourcesServiceStubContent
        resource.fields.forEach((field, idx) => {
          if (field.key === 'MUL') {
            content = content.replace(new RegExp(`###referencedResourceSingular${ idx }###`, 'g'), field.foreignKeyDetails.resourceSingular)
            content = content.replace(new RegExp(`###referencedResourceSlug${ idx }###`, 'g'), field.foreignKeyDetails.resourceSlug)
          }
        })
      } else {
        content = resourcesServiceStubContent.replace(/###resourceSlug###/g, resource.resourceSlug)
        content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      }
      
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
        resourceUrl: resource.resourceSlug,
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
        formProperties: requiredFields
          .map(field => formPropertyCallback(field, true))
          .concat(optionalFields.map(field => formPropertyCallback(field, false))),
        formFields: fillableFields.map(extractFieldName),
        bulkUpdateFields: resource.bulkUpdateFields,
        tableType: resource.tableType
      }

      writeFile(relativePath.replace('userResource.json', `${resource.resourceSingular}Resource.json`), JSON.stringify(resourceObject))
    })

    function formPropertyCallback (field, required) {
      const properties = {
        id: field.name,
        label: camelCase(field.name, {pascalCase: true}),
        required
      }
      if (field.name.includes('password')) {
        properties.type = 'password'
      }
      if (field.name.includes('date') || field.type === 'timestamp') {
        properties.type = 'datetime-local'
      }
      if (field.hasOwnProperty('foreignKeyDetails')) {
        properties.type = 'select'
        properties.slug = field.foreignKeyDetails.resourceSlug
        properties.itemLabel = resources.find(item => item.tableName === field.foreignKeyDetails.tableName).fields[1].name
      }
      return properties
    }
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