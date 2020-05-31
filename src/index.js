const fs = require('fs')

const generateProject = ({ templatePath, projectPath, currentDirectory, databaseOptions }) => {
  const filesToCreate = fs.readdirSync(templatePath)

  for (let file of filesToCreate) {
    const origFilePath = `${templatePath}/${file}`

    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8')

      if (file === '.npmignore') {
        file = '.gitignore'
      }
      const writePath = `${currentDirectory}/${projectPath}/${file}`
      fs.writeFileSync(writePath, contents, 'utf8')

    } else if (stats.isDirectory()) {

      fs.mkdirSync(`${currentDirectory}/${projectPath}/${file}`)
      generateProject({
        templatePath: `${templatePath}/${file}`,
        projectPath: `${projectPath}/${file}`,
        currentDirectory
      })
    }
  }
}

module.exports = {
  generateProject
}