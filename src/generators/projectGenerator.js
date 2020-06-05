const fs = require('fs')
const generateFile = require('./fileGenerator')

const generateProject = ({
  templatePath,
  stubsPath,
  scanPath,
  outputPath,
  filesToBeReplaced,
  filesToBeOmmitted,
  databaseOptions,
  hasAuthentication
}) => {
  const filesToCreate = fs.readdirSync(scanPath)

  for (let fileName of filesToCreate) {
    const fullFilePath = `${scanPath}/${fileName}`

    const stats = fs.statSync(fullFilePath)

    if (stats.isFile()) {
      if (filesToBeReplaced.includes(fullFilePath)) {
        generateFile({
          fullFilePath,
          templatePath,
          stubsPath,
          outputPath,
          fileName,
          hasAuthentication
        })
      } else if (!filesToBeOmmitted.includes(fullFilePath)) {
        fs.copyFileSync(fullFilePath, `${outputPath}/${fileName}`)
      }
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${outputPath}/${fileName}`)
      generateProject({
        templatePath,
        stubsPath,
        scanPath: `${scanPath}/${fileName}`,
        outputPath: `${outputPath}/${fileName}`,
        filesToBeReplaced,
        filesToBeOmmitted,
        databaseOptions,
        hasAuthentication
      })
    }
  }
}

module.exports = generateProject