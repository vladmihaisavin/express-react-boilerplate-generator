const path = require('path')
const os = require('os')
const pluralize = require('pluralize')
const { addTabs, removeLines } = require('../../helpers/fileFormatting')
const { MYSQL_TYPES_TO_JOI, reconstructRawType } = require('../../databaseParser/mysqlInterpreter')
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
    'mysql': MYSQL_TYPES_TO_JOI
  }
  const databaseRawReconstructors = {
    'mysql': reconstructRawType
  }

  const generateResourcesControllers = (relativePath) => {
    const resourcesControllerStubContent = readStub(relativePath.replace('users.js', 'resourcesController.js'))
    resources.forEach(resource => {
      let content = resourcesControllerStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
      content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
      
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
    const resourceRepositoryStubContent = readStub(relativePath.replace('user.js', path.join(databaseType, 'resourceRepository.js')))
    resources.forEach(resource => {
      let content = resourceRepositoryStubContent.replace(/###resourceSingular###/g, resource.resourceSingular)
      writeFile(relativePath.replace('user.js', `${resource.resourceSingular}.js`), content)
    })
  }

  const generateRepositoryIndex = (relativePath) => {
    let content = readStub(relativePath.replace('index.js', path.join(databaseType, 'index.js')))

    content = content.replace(/###DatabaseType###/g, databaseType)

    if (resources.length > 0) {
      const RepositoryImports = resources.map(resource => {
        return `const ${resource.resourceSingular}Repository = require('./${resource.resourceSingular}')`
      }).join(os.EOL)
      content = content.replace(/###RepositoryImports###/g, RepositoryImports)
      
      const RepositoryExports = resources.map(resource => {
        return `${resource.resourceSingular}: ${resource.resourceSingular}Repository(${databaseType}Client)`
      }).join(os.EOL)
      content = content.replace(/###RepositoryExports###/g, RepositoryExports)
    } else {
      content = removeLines(content, [0, 3])
    }

    writeFile(relativePath, content)
  }

  const generateResourcesValidators = (relativePath) => {
    const resourcesValidatorStubContent = readStub(relativePath.replace('users.js', 'resourcesValidator.js'))
    const databaseTypesInterpreter = databaseTypesInterpreters[databaseType]
    resources.forEach(resource => {
      const StoreBodyRules = resource.fields.filter(requiredFieldsRule).map(field => `Joi${databaseTypesInterpreter[field.type]}.required()`)
      const UpdateBodyRules = resource.fields.filter(isNormalField).map(field => `Joi${databaseTypesInterpreter[field.type]}`)
      let content = resourcesValidatorStubContent.replace(/###StoreBodyRules###/g, StoreBodyRules)
      content = content.replace(/###UpdateBodyRules###/g, UpdateBodyRules)
      writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
    })
  }

  const generateRoutes = (relativePath) => {
    let content = readStub(relativePath)
    
    if (hasAuthentication) {
      const authenticableResourceName = pluralize.singular(authenticableResourceTableName)
      const AccountsRoutes = `${addTabs(1)}app.use('/accounts', accounts({ config, ${authenticableResourceName}Repository: repositories.${authenticableResourceName} }))`
      const AccountsControllerImport = `const accounts = require('./controllers/accounts')`
      content = content.replace(/###AccountsRoutes###/g, AccountsRoutes)
      content = content.replace(/###AccountsControllerImport###/g, AccountsControllerImport)
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
      content = removeLines(content, [4, 14])
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
  }

  return {
    generateResourcesControllers,
    generateResourceModels,
    generateResourceRepositories,
    generateRepositoryIndex,
    generateResourcesValidators,
    generateRoutes,
    generateSchemas,
    generatePackageJson
  }
}