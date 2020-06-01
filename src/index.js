const fs = require('fs')

const generateProject = ({ scanPath, outputPath, currentDirectory, filesToBeReplaced, databaseOptions }) => {
  const filesToCreate = fs.readdirSync(scanPath)

  for (let file of filesToCreate) {
    const origFilePath = `${scanPath}/${file}`

    const stats = fs.statSync(origFilePath)

    if (stats.isFile() && !filesToBeReplaced.includes(origFilePath)) {
      const contents = fs.readFileSync(origFilePath, 'utf8')

      if (file === '.npmignore') {
        file = '.gitignore'
      }
      const writePath = `${currentDirectory}/${outputPath}/${file}`
      fs.writeFileSync(writePath, contents, 'utf8')
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${currentDirectory}/${outputPath}/${file}`)
      generateProject({
        scanPath: `${scanPath}/${file}`,
        outputPath: `${outputPath}/${file}`,
        currentDirectory,
        filesToBeReplaced
      })
    }
  }
}

module.exports = {
  generateProject
}