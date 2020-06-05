const fs = require('fs')

const generateProject = (options) => {
  const {
    templatePath,
    scanPath,
    outputPath,
    filesToBeReplaced,
    filesToBeOmmitted,
    generateFile
  } = options
  const filesToCreate = fs.readdirSync(scanPath)

  for (let fileName of filesToCreate) {
    const fullFilePath = `${scanPath}/${fileName}`

    const stats = fs.statSync(fullFilePath)

    if (stats.isFile()) {
      if (filesToBeReplaced.includes(fullFilePath)) {
        generateFile({
          relativePath: fullFilePath.replace(templatePath, '')
        })
      } else if (!filesToBeOmmitted.includes(fullFilePath)) {
        fs.copyFileSync(fullFilePath, `${outputPath}/${fileName}`)
      }
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${outputPath}/${fileName}`)

      generateProject({
        ...options,
        scanPath: `${scanPath}/${fileName}`,
        outputPath: `${outputPath}/${fileName}`
      })
    }
  }
}

module.exports = generateProject