const path = require('path')

const createPath = (templatePath) => filePath => path.join(templatePath, filePath)

const FILES_TO_BE_REPLACED = [
  '/server/src/controllers/users.js',
  '/server/src/models/user.json',
  '/server/src/repositories/user.js',
  '/server/src/validation/users.js',
  '/server/src/routes.js',
  '/server/infra/schemas.js',
  '/server/package.json',
  '/client/src/index.js',
  '/client/src/components/sections/Users.jsx',
  '/client/src/components/sections/UserForm.jsx',
  '/client/src/components/structure/Navigator.jsx',
  '/client/src/components/structure/Header.jsx',
  '/client/src/services/users.js',
  '/client/src/static/userResource.json',
  '/client/package.json'
]

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
  getFilesToBeOmmitted
}