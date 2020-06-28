const path = require('path')
const os = require('os')
const pluralize = require('pluralize')
const { addSpaces, addTabs, removeLines } = require('../../helpers/fileFormatting')
const { MYSQL_TYPES_TO_JOI, MYSQL_TYPES_TO_SWAGGER, reconstructRawType } = require('../../databaseParser/mysqlInterpreter')
const {
  extractFieldName,
  isFillableField,
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
    const mmResourcesControllerStubContent = readStub(relativePath.replace('users.js', 'mmResourcesController.js'))
    const databaseTypesInterpreter = databaseTypesInterpreters.swagger[databaseType]
    const getResourcePropertyTypes = (field) => {
      const fieldDetails = databaseTypesInterpreter[field.type]
      const result = []
      if (fieldDetails) {
        Object.keys(fieldDetails).forEach(key => {
          result.push(`${addTabs(1)} *${addSpaces(15)}${key}: ${fieldDetails[key]}`)
        })
      }
      return result.join(os.EOL)
    }

    resources.forEach(resource => {
      let content
      if (resource.tableType === 'pivot') {
        content = mmResourcesControllerStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
        content = content.replace(/###ResourcePlural###/g, resource.ResourcePlural)
        content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
        content = content.replace(/###resourceSlug###/g, resource.resourceSlug)

        resource.fields.forEach((field, idx) => {
          if (field.key === 'MUL') {
            content = content.replace(new RegExp(`###referencedResourceSingular${ idx + 1 }###`, 'g'), field.foreignKeyDetails.resourceSingular)
            content = content.replace(new RegExp(`###referencedResourceSlug${ idx + 1 }###`, 'g'), field.foreignKeyDetails.resourceSlug)
          }
        })
      } else {
        content = resourcesControllerStubContent.replace(/###resourcePlural###/g, resource.resourcePlural)
        content = content.replace(/###ResourcePlural###/g, resource.ResourcePlural)
        content = content.replace(/###resourceSingular###/g, resource.resourceSingular)
        content = content.replace(/###resourceSlug###/g, resource.resourceSlug)
  
        const ResourceProperties = resource.fields.filter(isFillableField).map(field => {
          return `${addTabs(1)} *${addSpaces(13)}${field.name}:${os.EOL}${getResourcePropertyTypes(field)}`
        }).join(os.EOL)
        content = content.replace(/###ResourceProperties###/g, ResourceProperties)
        
        const RequiredResourceProperties = resource.fields.filter(requiredFieldsRule).map(field => {
          return `${addTabs(1)} *${addSpaces(11)}- ${field.name}`
        }).join(os.EOL)
        content = content.replace(/###RequiredResourceProperties###/g, RequiredResourceProperties)
        
        const AllRequiredResourceProperties = resource.fields.filter(isFillableField).map(field => {
          return `${addTabs(1)} *${addSpaces(11)}- ${field.name}`
        }).join(os.EOL)
        content = content.replace(/###AllRequiredResourceProperties###/g, AllRequiredResourceProperties)
      }
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
      const mmResourceRepositoryStubContent = readStub(relativePath.replace('user.js', path.join(databaseType, 'mmResourceRepository.js')))
      resources.forEach(resource => {
        let content
        if (resource.tableType === 'pivot') {
          content = mmResourceRepositoryStubContent.replace(/###resourceSingular###/g, resource.resourceSingular)
          resource.fields.forEach((field, idx) => {
            if (field.key === 'MUL') {
              content = content.replace(new RegExp(`###referencedResourceSingular${ idx + 1 }###`, 'g'), field.foreignKeyDetails.resourceSingular)
            }
          })
        } else {
          content = resourceRepositoryStubContent.replace(/###resourceSingular###/g, resource.resourceSingular)

          if (resource.tableName === authenticableResourceTableName) {
            const HashPasswordImport = `const { hashPassword } = require('../helpers/bcrypt')`
            const StoreHashPassword = `${addTabs(3)}body.password = await hashPassword(body.password)`
            const UpdateHashPassword = `${addTabs(3)}if (body.password) {${os.EOL}${addTabs(4)}body.password = await hashPassword(body.password)${os.EOL}${addTabs(3)}}${os.EOL}`
            content = content.replace(/###HashPasswordImport###/g, HashPasswordImport)
            content = content.replace(/###StoreHashPassword###/g, StoreHashPassword)
            content = content.replace(/###UpdateHashPassword###/g, UpdateHashPassword)
          } else {
            content = removeLines(content, [1, 18, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 59, 102])
          }
          let urlForResources = ''
          if (resource.tableType === 'connected') {
            const urlForResourcesArray = []
            resource.fields.forEach(field => {
              if (field.hasOwnProperty('foreignKeyDetails')) {
                urlForResourcesArray.push(`{ key: '${field.name}', slug: '${field.foreignKeyDetails.resourcePlural}' }`)
              }
            })
            urlForResources = `, [${urlForResourcesArray.join(', ')}]`
          }
          content = content.replace(/###urlForResources###/g, urlForResources)
        }
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
        }).join(`,${os.EOL}`)
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
      if (resource.tableType !== 'pivot') {
        const StoreBodyRules = resource.fields.filter(requiredFieldsRule)
          .map(field => `${addTabs(3)}${field.name}: Joi${databaseTypesInterpreter[field.type]}.required()`).join(`,${os.EOL}`)
        let content = resourcesValidatorStubContent.replace(/###StoreBodyRules###/g, StoreBodyRules)

        const UpdateBodyParticles = resource.fields.filter(isFillableField)
          .map(field => `${addTabs(3)}${field.name}: Joi${databaseTypesInterpreter[field.type]}`)

        const UpdateBodyRules = UpdateBodyParticles.map(particle => `${particle}.required()`).join(`,${os.EOL}`)
        content = content.replace(/###UpdateBodyRules###/g, UpdateBodyRules)

        const PartialUpdateBodyRules = UpdateBodyParticles.join(`,${os.EOL}`)
        content = content.replace(/###PartialUpdateBodyRules###/g, PartialUpdateBodyRules)
        
        const BulkUpdateBodyRules = UpdateBodyParticles.map(particle => `${addTabs(1)}${particle}`).join(`,${os.EOL}`)
        content = content.replace(/###BulkUpdateBodyRules###/g, BulkUpdateBodyRules)

        writeFile(relativePath.replace('users.js', `${resource.resourcePlural}.js`), content)
      }
    })
  }

  const generateRoutes = (relativePath) => {
    let content = readStub(relativePath)

    if (hasAuthentication) {
      const authenticableResourceName = pluralize.singular(authenticableResourceTableName)
      const AuthRoutes = [
        `${addTabs(1)}app.use('/auth', auth({ config, ${authenticableResourceName}Repository: repositories.${authenticableResourceName} }))`,
        `${addTabs(1)}app.use(authenticate)`
      ].join(os.EOL)
      const AuthControllerImport = `const auth = require('./controllers/auth')`
      content = content.replace(/###AuthRoutes###/g, `${AuthRoutes}${os.EOL}`)
      content = content.replace(/###AuthControllerImport###/g, AuthControllerImport)
    } else {
      content = removeLines(content, [2, 3, 13])
    }

    if (resources.length > 0) {
      const ResourceControllerImports = resources.map(resource => {
        return `const ${resource.resourcePlural} = require('./controllers/${resource.resourcePlural}')`
      }).join(os.EOL)
      content = content.replace(/###ResourceControllerImports###/g, ResourceControllerImports)

      const NormalResourceRoutes = resources.map(resource => {
        return `${addTabs(1)}app.use('/${resource.resourceSlug}', ${resource.resourcePlural}(repositories.${resource.resourceSingular}))`
      }).join(os.EOL)
      const PivotResourceRoutes = resources.filter(resource => resource.tableType === 'pivot').map(resource => {
        return `${addTabs(1)}app.use(${resource.resourcePlural}(repositories.${resource.resourceSingular}))`
      }).join(os.EOL)

      content = content.replace(/###ResourceRoutes###/g, [NormalResourceRoutes, PivotResourceRoutes].join(`${os.EOL}${os.EOL}`))
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
      content = removeLines(content, [6, 9, 11, 20, 25, 26, 27, 31])
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config }) => {')
    } else if (!hasAuthentication) {
      content = removeLines(content, [6, 9, 25, 26, 27])
      content = content.replace(/###MethodHeader###/g, 'module.exports = ({ config, mysqlClient }) => {')
    } else if (!hasResources) {
      content = removeLines(content, [11, 20, 31])
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