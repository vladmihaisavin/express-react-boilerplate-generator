const inquirer = require('inquirer')

const inquirerInputValidator = (messageStart) => (input) => {
  if (/^([A-Za-z\-\_\d\.])+$/.test(input)) {
    return true
  }
  return `${messageStart} may only include letters, numbers, underscores and hashes.`
}

const setProjectName = () => [
  {
    name: 'projectName',
    type: 'input',
    default: 'output',
    message: 'Please input the project name:',
    validate: inquirerInputValidator('Project name')
  }
]

const chooseAuthentication = () => [
  {
    name: 'authentication',
    type: 'list',
    default: 'passport.js with jwt',
    message: 'Please select the authentication type:',
    choices: [new inquirer.Separator(), 'passport.js with jwt', new inquirer.Separator(), 'none', new inquirer.Separator()]
  }
] 

const chooseDatabaseType = () => [
  {
    name: 'database_type',
    type: 'list',
    default: 'mysql',
    message: 'Please select the database type:',
    choices: [new inquirer.Separator(), 'mysql', new inquirer.Separator(), 'none', new inquirer.Separator()]
  }
]

const chooseAuthenticableResource = () => [
  {
    name: 'authenticableResourceTable',
    type: 'input',
    default: 'users',
    message: 'Please input the database table name for the authenticable resource:',
    validate: inquirerInputValidator('A table name')
  }
]

const setDatabaseCredentials = () => [
  {
    name: 'host',
    type: 'input',
    default: '127.0.0.1',
    message: 'Please input the database host:',
    validate: inquirerInputValidator('A host')
  },
  {
    name: 'port',
    type: 'input',
    default: '3307',
    message: 'Please input the database port:',
    validate: inquirerInputValidator('A port')
  },
  {
    name: 'user',
    type: 'input',
    default: 'myUser',
    message: 'Please input the database username:',
    validate: inquirerInputValidator('A username')
  },
  {
    name: 'password',
    type: 'password',
    default: 'asd123',
    mask: '*',
    message: 'Please input the database password:',
    validate: inquirerInputValidator('A username\'s password')
  },
  {
    name: 'database',
    type: 'input',
    default: 'test_db',
    message: 'Please input the database name:',
    validate: inquirerInputValidator('A database name')
  }
]

module.exports = {
  setProjectName,
  chooseAuthentication,
  chooseDatabaseType,
  chooseAuthenticableResource,
  setDatabaseCredentials
}