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
const {
  setProjectName,
  chooseAuthentication,
  chooseDatabaseType,
  chooseAuthenticableResource,
  setDatabaseCredentials
} = require('./interactions')

let outputPath

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
    if (answers['databaseType'] !== 'none') {
      inquirer.prompt(setDatabaseCredentials())
        .then((connectionData) => {
          resolve({ ...answers, connectionData })
        })
        .catch((err) => reject(err))
    } else {
      resolve(answers)
    }
  }))
  .then((answers) => new Promise((resolve, reject) => {
    if (answers['authentication'] !== 'none' && answers['databaseType'] !== 'none') {
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
    outputPath = `${CURR_DIR}/temp/${projectName}`
    const templatePath = path.join(__dirname, '../../../express-react-boilerplate')
    const stubsPath = path.join(__dirname, '../../stubs')

    const filesToBeReplaced = getFilesToBeReplaced(templatePath)
    const hasAuthentication = answers['authentication'] !== 'none'
    const filesToBeOmmitted = getFilesToBeOmmitted(templatePath, hasAuthentication)

    const hasDatabase = answers['databaseType'] !== 'none'
    const databaseOptions = {
      hasDatabase,
      type: answers['databaseType'],
      connectionData: answers['connectionData']
    }

    let resources = []
    if (hasDatabase) {
      const databaseParser = await createDatabaseParser(databaseOptions)
      resources = await databaseParser.gatherResources()
      console.log(JSON.stringify(resources))
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
          authenticableResourceTableName: answers['authenticableResourceTable'],
          databaseType: hasDatabase ? answers['databaseType'] : '',
          resources,
          fileManager
        })
      }
    })

    fs.mkdirSync(outputPath)

    await generateProject({
      templatePath,
      scanPath: templatePath,
      outputPath,
      filesToBeReplaced,
      filesToBeOmmitted,
      generateFile
    })
  })
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    removeDirectory(outputPath)
    process.exit(1)
  })