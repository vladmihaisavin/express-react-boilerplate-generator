const fs = require('fs')

const resolveIfNoRemainingFiles = (counter, resolve) => {
  if (counter === 0) {
    resolve()
  }
}

module.exports = (options) => new Promise((resolve, reject) => {
  let remainingFiles = 0

  const generateProject = (projectOptions) => {
    const {
      templatePath,
      scanPath,
      outputPath,
      filesToBeReplaced,
      filesToBeOmmitted,
      generateFile
    } = projectOptions
    const filesToCreate = fs.readdirSync(scanPath)
    remainingFiles += filesToCreate.length

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
          ...projectOptions,
          scanPath: `${scanPath}/${fileName}`,
          outputPath: `${outputPath}/${fileName}`
        })
      }
      remainingFiles--
    }
  }

  generateProject(options)
  setInterval(() => {
    resolveIfNoRemainingFiles(remainingFiles, resolve)
  }, 1000)
})