const fs = require('fs')
const path = require('path')

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
    writeFile: (relativePath, content) => fs.writeFileSync(`${outputPath}/${relativePath}`, content, 'utf8')
  })
}