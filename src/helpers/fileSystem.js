const fs = require('fs')
const path = require('path')
const { removeLines, newLineWithTabs } = require('./fileFormatting')

const removeDirectory = (pathName) => {
  if (fs.existsSync(pathName)) {
    fs.readdirSync(pathName).forEach((file, index) => {
      const currPath = path.join(pathName, file)
      if (fs.lstatSync(currPath).isDirectory()) {
        removeDirectory(currPath)
      } else {
        fs.unlinkSync(currPath)
      }
    })
    fs.rmdirSync(pathName)
  }
}

module.exports = {
  removeDirectory,
  createFileManager: ({ stubsPath, outputPath }) => ({
    readFile: (relativePath) => fs.readFileSync(path.join(stubsPath, `${relativePath}.stub`), 'utf8'),
    writeFile: (fileName, content) => fs.writeFileSync(`${outputPath}/${fileName}`, content, 'utf8'),
    removeLines,
    newLineWithTabs
  })
}