#!/usr/bin/env node

const CURR_DIR = process.cwd()
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const generateProject = require('../../generators/projectGenerator')
const { getFilesToBeReplaced, getFilesToBeOmmitted } = require('../../helpers/constants')
const { removeDirectory, createFileManager } = require('../../helpers/fileSystem')
const createClientGenerators = require('../../generators/resources/clientGenerators')
const createServerGenerators = require('../../generators/resources/serverGenerators')
const createFileGenerator = require('../../generators/fileGenerator')
const createDatabaseParser = require('../../databaseParser')

let outputPath

const setProjectName = () => [
  {
    name: 'projectName',
    type: 'input',
    message: 'Please input the project name:',
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true
      }
      return 'Project name may only include letters, numbers, underscores and hashes.'
    }
  }
]

const chooseAuthentication = () => [
  {
    name: 'authentication',
    type: 'list',
    message: 'Please select the authentication type:',
    choices: [new inquirer.Separator(), 'passport.js with jwt', new inquirer.Separator(), 'none', new inquirer.Separator()]
  }
] 

const chooseDatabaseType = () => [
  {
    name: 'database_type',
    type: 'list',
    message: 'Please select the database type:',
    choices: [new inquirer.Separator(), 'mysql', new inquirer.Separator(), 'none', new inquirer.Separator()]
  }
]

const chooseAuthenticableResource = () => [
  {
    name: 'authenticableResourceTable',
    type: 'input',
    message: 'Please input the database table name for the authenticable resource:',
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true
      }
      return 'A table name may only include letters, numbers, underscores and hashes.'
    }
  }
]

inquirer.prompt(setProjectName())
  .then((answers) => new Promise((resolve, reject) => {
    inquirer.prompt(chooseAuthentication())
      .then((newAnswer) => {
        resolve({ ...answers, ...newAnswer })
      })
      .catch((err) => reject(err))
  }))
  .then((answers) => new Promise((resolve, reject) => {
    inquirer.prompt(chooseDatabaseType())
      .then((newAnswer) => {
        resolve({ ...answers, ...newAnswer })
      })
      .catch((err) => reject(err))
  }))
  .then((answers) => new Promise((resolve, reject) => {
    if (answers['authentication'] !== 'none' && answers['database_type'] !== 'none') {
      inquirer.prompt(chooseAuthenticableResource())
        .then((newAnswer) => {
          resolve({ ...answers, ...newAnswer })
        })
        .catch((err) => reject(err))
    } else {
      resolve(answers)
    }
  }))
  .then(async answers => {
    const projectName = answers['projectName']
    outputPath = `${CURR_DIR}/${projectName}`
    const templatePath = path.join(__dirname, '../../../express-react-boilerplate')
    const stubsPath = path.join(__dirname, '../../stubs')

    const filesToBeReplaced = getFilesToBeReplaced(templatePath)
    const hasAuthentication = answers['authentication'] !== 'none'
    const filesToBeOmmitted = getFilesToBeOmmitted(templatePath, hasAuthentication)

    const hasDatabase = answers['database_type'] !== 'none'
    const databaseOptions = {
      hasDatabase,
      type: answers['database_type']
    }

    let resources = []
    if (hasDatabase) {
      const databaseParser = createDatabaseParser(databaseOptions)
      resources = await databaseParser.gatherResources()
    }
    
    const fileManager = createFileManager({ stubsPath, outputPath })
    const generateFile = createFileGenerator({
      resourceGenerators: {
        client: createClientGenerators({
          projectName,
          hasAuthentication,
          resources,
          fileManager
        }),
        server: createServerGenerators({
          projectName,
          hasAuthentication,
          authenticableResourceTableName,
          databaseType: answers['database_type'],
          resources,
          fileManager
        })
      }
    })

    fs.mkdirSync(outputPath)

    generateProject({
      templatePath,
      scanPath: templatePath,
      outputPath,
      filesToBeReplaced,
      filesToBeOmmitted,
      generateFile
    })
  })
  .catch((err) => {
    console.error(err)
    removeDirectory(outputPath)
  })