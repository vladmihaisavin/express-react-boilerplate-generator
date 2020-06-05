#!/usr/bin/env node

const CURR_DIR = process.cwd()
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const generateProject = require('../../generators/projectGenerator')
const { getFilesToBeReplaced, getFilesToBeOmmitted } = require('../../helpers/constants')
const { removeDirectory } = require('../../helpers/fileSystem')
const createClientGenerators = require('../../generators/resources/clientGenerators')
const createServerGenerators = require('../../generators/resources/serverGenerators')
const createFileGenerator = require('../../generators/fileGenerator')

let outputPath

const setProjectName = () => [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true
      }
      return 'Project name may only include letters, numbers, underscores and hashes.'
    }
  }
]

const chooseDatabaseType = () => [
  {
    name: 'database',
    type: 'list',
    message: 'Please select the database type:',
    choices: [new inquirer.Separator(), 'mysql', new inquirer.Separator(), 'none', new inquirer.Separator()]
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
  .then(answers => {
    const projectName = answers['projectName']
    outputPath = `${CURR_DIR}/${projectName}`
    const templatePath = path.join(__dirname, '../../../express-react-boilerplate')
    const stubsPath = path.join(__dirname, '../../stubs')

    const filesToBeReplaced = getFilesToBeReplaced(templatePath)
    const hasAuthentication = answers['authentication'] !== 'none'
    const filesToBeOmmitted = getFilesToBeOmmitted(templatePath, hasAuthentication)

    const databaseOptions = {
      type: answers['database']
    }
    
    const clientGenerators = createClientGenerators(resources, { stubsPath, outputPath })
    const serverGenerators = createServerGenerators(resources, { stubsPath, outputPath })
    const generateFile = createFileGenerator({
      stubsPath,
      outputPath,
      hasAuthentication,
      resourceGenerators: {
        client: clientGenerators,
        server: serverGenerators
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