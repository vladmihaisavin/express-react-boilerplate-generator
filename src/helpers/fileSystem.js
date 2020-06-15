const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')

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

const zipDirectory = (outputPath) => new Promise((resolve, reject) => {
  const zip = new AdmZip()
  zip.addLocalFolderAsync(outputPath, (success, err) => {
    if (err) {
      return reject(err)
    }
    zip.writeZip(`${outputPath}.zip`, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
})

module.exports = {
  removeDirectory,
  zipDirectory,
  createFileManager: ({ stubsPath, outputPath }) => ({
    readStub: (relativePath) => fs.readFileSync(path.join(stubsPath, `${relativePath}.stub`), 'utf8'),
    writeFile: (relativePath, content) => fs.writeFileSync(`${outputPath}/${relativePath}`, content, 'utf8')
  })
}