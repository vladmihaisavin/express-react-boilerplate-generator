#!/usr/bin/env node

const CURR_DIR = process.cwd()
const inquirer = require('inquirer')
const fs = require('fs')
const generateProject = require('./src/projectGenerator')
const { getFilesToBeReplaced, getFilesToBeOmmitted } = require('./src/constants')
const { removeDirectory } = require('./src/fileSystem')

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
    const templatePath = `${__dirname}/express-react-boilerplate`
    const stubsPath = `${__dirname}/src/stubs`

    const filesToBeReplaced = getFilesToBeReplaced(templatePath)
    const hasAuthentication = answers['authentication'] !== 'none'
    const filesToBeOmmitted = getFilesToBeOmmitted(templatePath, hasAuthentication)

    const databaseOptions = {
      type: answers['database']
    }

    fs.mkdirSync(outputPath)

    generateProject({
      templatePath,
      stubsPath,
      scanPath: templatePath,
      outputPath,
      filesToBeReplaced,
      filesToBeOmmitted,
      databaseOptions,
      hasAuthentication
    })
  })
  .catch((err) => {
    console.error(err)
    removeDirectory(outputPath)
  })