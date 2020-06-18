const path = require('path')
const os = require('os')
const pluralize = require('pluralize')
const { addTabs, removeLines } = require('../../helpers/fileFormatting')
const { MYSQL_TYPES_TO_JOI, MYSQL_TYPES_TO_SWAGGER, reconstructRawType } = require('../../databaseParser/mysqlInterpreter')
const {
  extractFieldName,
  isNormalField,
  requiredFieldsRule,
  optionalFieldsRule
} = require('./commonMethods')

module.exports = ({
  projectName,
  hasAuthentication,
  authenticableResourceTableName,
  databaseType,
  resources,
  fileManager
}) => {
  const {
    readStub,
    writeFile
  } = fileManager

  const databaseTypesInterpreters = {
    joi: {
      mysql: MYSQL_TYPES_TO_JOI
    },
    swagger: {
      mysql: MYSQL_TYPES_TO_SWAGGER
    }
  }
  const databaseRawReconstructors = {
    'mysql': reconstructRawType
  }

  const generateResourcesControllers = (relativePath) => {
    const resourcesControllerStubContent = readStub(relativePath.replace('users.js', 'resourcesController.js'))
    const databaseTypesInterpreter = databaseTypesInterpreters.swagger[databaseType]
    const getResourcePropertyTypes = (field) => {
      const fieldDetails = databaseTypesInterpreter[field.type]
      const result = []
      if (fieldDetails) {
        Object.keys(fieldDetails).forEach(key => {
          result.push(`${addTabs(1)} * ${addTabs(7)}${key}: ${fieldDetails[key]}`)
        })
      }
      return result.join(os.EOL)
    }

    resources.forEach(resource => {
      let content = resourcesControllerStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###ResourcePlural###/g, resource.ResourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)

      const ResourceProperties = resource.fields.filter(isNormalField).map(field => {
        return `${addTabs(1)} * ${addTabs(6)}${field.name}:${os.EOL}${getResourcePropertyTypes(field)}`
      }).join(os.EOL)
      content = content.replace(/###ResourceProperties###/g, ResourceProperties)
      
      const RequiredResourceProperties = resource.fields.filter(requiredFieldsRule).map(field => {
        return `${addTabs(1)} * ${addTabs(5)}- ${field.name}`
      }).join(os.EOL)
      content = content.replace(/###RequiredResourceProperties###/g, RequiredResourceProperties)

      writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
    })
  }

  const generateResourceModels = (relativePath) => {
    resources.forEach(resource => {
      const resourceObject = {
        tableName: resource.tableName,
        fields: {
          required: resource.fields.filter(requiredFieldsRule).map(extractFieldName),
          optional: resource.fields.filter(optionalFieldsRule).map(extractFieldName),
          projection: resource.fields.map(extractFieldName)
        }
      }

      writeFile(relativePath.replace('user.json', `${resource.resourceSingular}.json`), JSON.stringify(resourceObject))
    })
  }

  const generateResourceRepositories = (relativePath) => {
    if (databaseType) {
      const resourceRepositoryStubContent = readStub(relativePath.replace('user.js', path.join(databaseType, 'resourceRepository.js')))
      resources.forEach(resource => {
        let content = resourceRepositoryStubContent.replace(/###resourceSingular###/g, resource.resourceSingular)
        writeFile(relativePath.replace('user.js', `${resource.resourceSingular}.js`), content)
      })
    }
  }

  const generateRepositoryIndex = (relativePath) => {
    if (databaseType) {
      let content = readStub(relativePath.replace('index.js', path.join(databaseType, 'index.js')))

      content = content.replace(/###DatabaseType###/g, databaseType)

      if (resources.length > 0) {
        const RepositoryImports = resources.map(resource => {
          return `const ${resource.resourceSingular}Repository = require('./${resource.resourceSingular}')`
        }).join(os.EOL)
        content = content.replace(/###RepositoryImports###/g, RepositoryImports)
        
        const RepositoryExports = resources.map(resource => {
          return `${addTabs(1)}${resource.resourceSingular}: ${resource.resourceSingular}Repository(${databaseType}Client)`
        }).join(os.EOL)
        content = content.replace(/###RepositoryExports###/g, RepositoryExports)
      } else {
        content = removeLines(content, [0, 3])
      }

      writeFile(relativePath, content)
    }
  }

  const generateResourcesValidators = (relativePath) => {
    const resourcesValidatorStubContent = readStub(relativePath.replace('users.js', 'resourcesValidator.js'))
    const databaseTypesInterpreter = databaseTypesInterpreters.joi[databaseType]
    resources.forEach(resource => {
      const StoreBodyRules = resource.fields.filter(requiredFieldsRule)
        .map(field => `${addTabs(3)}${field.name}: Joi${databaseTypesInterpreter[field.type]}.required()`).join(`,${os.EOL}`)
      const UpdateBodyRules = resource.fields.filter(isNormalField)
        .map(field => `${addTabs(3)}${field.name}: Joi${databaseTypesInterpreter[field.type]}`).join(`,${os.EOL}`)
      let content = resourcesValidatorStubContent.replace(/###StoreBodyRules###/g, StoreBodyRules)
      content = content.replace(/###UpdateBodyRules###/g, UpdateBodyRules)
      writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
    })
  }

  const generateRoutes = (relativePath) => {
    let content = readStub(relativePath)
    
    if (hasAuthentication) {
      const authenticableResourceName = pluralize.singular(authenticableResourceTableName)
      const AuthRoutes = `${addTabs(1)}app.use('/auth', auth({ config, ${authenticableResourceName}Repository: repositories.${authenticableResourceName} }))`
      const AuthControllerImport = `const auth = require('./controllers/auth')`
      content = content.replace(/###AuthRoutes###/g, AuthRoutes)
      content = content.replace(/###AuthControllerImport###/g, AuthControllerImport)
    } else {
      content = removeLines(content, [2, 3, 13])
    }

    if (resources.length > 0) {
      const ResourceControllerImports = resources.map(resource => {
        return `const ${resource.resourcePlural} = require('./controllers/${resource.resourcePlural}')`
      }).join(os.EOL)
      content = content.replace(/###ResourceControllerImports###/g, ResourceControllerImports)
      
      const ResourceRoutes = resources.map(resource => {
        return `${addTabs(1)}app.use('/${resource.resourcePlural}', ${hasAuthentication ? 'authenticate, ' : ''}${resource.resourcePlural}(repositories.${resource.resourceSingular}))`
      }).join(os.EOL)
      content = content.replace(/###ResourceRoutes###/g, ResourceRoutes)
    } else {
      if (hasAuthentication) {
        content = removeLines(content, [4, 14])
      } else {
        content = removeLines(content, [2, 11])
      }
    }

    writeFile(relativePath, content)
  }

  const generateApp = (relativePath) => {
    let content = readStub(relativePath)

    const hasResources = resources.length > 0
    if (!hasAuthentication && !hasResources) {
      content = removeLines(content, [5, 8, 10, 19, 24, 25, 26, 30])
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config }) => {')
    } else if (!hasAuthentication) {
      content = removeLines(content, [5, 8, 24, 25, 26])
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config, mysqlClient }) => {')
    } else if (!hasResources) {
      content = removeLines(content, [10, 19, 30])
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config }) => {')
    } else {
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config, mysqlClient }) => {')
    }

    writeFile(relativePath, content)
  }
  
  const generateIndex = (relativePath) => {
    let content = readStub(relativePath)

    const hasResources = resources.length > 0
    if (!hasResources) {
      content = removeLines(content, [2, 40])
      content = content.replace(/###StartServerParams###/g, '')
      content = content.replace(/###CreateAppOptions###/g, '{ config }')
    } else {
      content = content.replace(/###StartServerParams###/g, 'mysqlClient')
      content = content.replace(/###CreateAppOptions###/g, '{ config, mysqlClient }')
    }

    writeFile(relativePath, content)
  }

  const generateSchemas = (relativePath) => {
    const schemas = []
    const reconstructor = databaseRawReconstructors[databaseType]
    resources.forEach(resource => {
      schemas.push({
        tableName: resource.tableName,
        tableSchema: resource.fields.map(field => ({
          name: field.name,
          type: reconstructor(field)
        }))
      })
    })
    writeFile(relativePath, JSON.stringify(schemas))
  }

  const generatePackageJson = (relativePath) => {
    let content = readStub(relativePath)
    writeFile(relativePath, content.replace(/###projectName###/g, projectName))
    if (!hasAuthentication) {
      content = removeLines(content, [10, 19, 20])
    }
  }

  return {
    generateResourcesControllers,
    generateResourceModels,
    generateResourceRepositories,
    generateRepositoryIndex,
    generateResourcesValidators,
    generateRoutes,
    generateApp,
    generateIndex,
    generateSchemas,
    generatePackageJson
  }
}