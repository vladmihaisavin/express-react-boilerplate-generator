const path = require('path')

const createPath = (templatePath) => filePath => path.join(templatePath, filePath)

const RELATIVE_PATHS = {
  SERVER_RESOURCES_CONTROLLER: '/server/src/controllers/users.js',
  SERVER_RESOURCE_MODEL: '/server/src/models/user.json',
  SERVER_RESOURCE_REPOSITORY: '/server/src/repositories/user.js',
  SERVER_REPOSITORY_INDEX: '/server/src/repositories/index.js',
  SERVER_RESOURCES_VALIDATOR: '/server/src/validation/users.js',
  SERVER_ROUTES: '/server/src/routes.js',
  SERVER_SCHEMAS: '/server/infra/schemas.json',
  SERVER_PACKAGE_JSON: '/server/package.json',
  CLIENT_ROUTES: '/client/src/index.js',
  CLIENT_RESOURCES_SECTION: '/client/src/components/sections/Users.jsx',
  CLIENT_RESOURCE_FORM_SECTION: '/client/src/components/sections/UserForm.jsx',
  CLIENT_HEADER: '/client/src/components/structure/Header.jsx',
  CLIENT_NAVIGATOR: '/client/src/components/structure/Navigator.jsx',
  CLIENT_RESOURCES_SERVICE: '/client/src/services/users.js',
  CLIENT_RESOURCE_RESOURCE: '/client/src/static/userResource.json',
  CLIENT_PACKAGE_JSON: '/client/package.json'
}

const FILES_TO_BE_REPLACED = Object.values(RELATIVE_PATHS)

const AUTH_FILES = [
  '/client/src/components/pages/Login.jsx',
  '/client/src/components/structure/ProtectedRoute.jsx',
  '/client/src/components/structure/AvatarMenu.jsx',
  '/client/src/services/auth.js'
]

const getFilesToBeReplaced = (templatePath) => FILES_TO_BE_REPLACED.map(createPath(templatePath))

const getFilesToBeOmmitted = (templatePath, hasAuthentication) => hasAuthentication ? [] : AUTH_FILES.map(createPath(templatePath))

module.exports = {
  getFilesToBeReplaced,
  getFilesToBeOmmitted,
  RELATIVE_PATHS
}