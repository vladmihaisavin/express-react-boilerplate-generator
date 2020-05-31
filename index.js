#!/usr/bin/env node

const CURR_DIR = process.cwd()
const inquirer = require('inquirer')
const fs = require('fs')
const { generateProject } = require('./src')

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

const chooseDatabase = () => [
  {
    name: 'database',
    type: 'list',
    message: `Please select the database type:`,
    choices: [new inquirer.Separator(), 'mysql', new inquirer.Separator(), 'none', new inquirer.Separator()]
  }
]

inquirer.prompt(setProjectName())
  .then((answers) => new Promise((resolve, reject) => {
    inquirer.prompt(chooseDatabase())
      .then((newAnswer) => {
        resolve({ ...answers, ...newAnswer })
      })
      .catch((err) => reject(err))
  }))
  .then(answers => {
    const projectName = answers['projectName']
    const templatePath = `${__dirname}/express-react-boilerplate`
    const databaseOptions = {
      type: answers['database']
    }

    fs.mkdirSync(`${CURR_DIR}/${projectName}`)

    generateProject({
      templatePath,
      projectPath: projectName,
      databaseOptions,
      currentDirectory: CURR_DIR
    })
  })
  .catch((err) => console.error(err))