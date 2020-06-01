const path = require('path')

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
  '/client/src/services/users.js',
  '/client/src/static/userResource.json',
  '/client/package.json'
]

const getFilesToBeReplaced = (templatePath) => FILES_TO_BE_REPLACED.map(filePath => path.join(templatePath, filePath))

module.exports = {
  getFilesToBeReplaced
}