const os = require('os')
const fs = require('fs')
const path = require('path')

const RELATIVE_PATHS = {
  CLIENT_HEADER: '/client/src/components/structure/Header.jsx'
}

const removeLines = (data, lines = []) => {
  return data
    .split(os.EOL)
    .filter((val, idx) => lines.indexOf(idx) === -1)
    .join(os.EOL)
}

const actions = ({
  relativePath,
  stubsPath,
  outputPath,
  fileName
}) => ({
  [RELATIVE_PATHS.CLIENT_HEADER]: ({ hasAuthentication }) => {
    const AvatarMenuImport = `import AvatarMenu from './AvatarMenu.jsx'${os.EOL}`
    const AvatarMenuComponentCall = `<Grid item>${os.EOL}\t\t\t\t\t\t<AvatarMenu />${os.EOL}\t\t\t\t\t</Grid>${os.EOL}`

    let contents = fs.readFileSync(path.join(stubsPath, `${relativePath}.stub`), 'utf8')
    if (hasAuthentication) {
      contents.replace(/###AvatarMenuImport###/g, AvatarMenuImport)
      contents.replace(/###AvatarMenuComponentCall###/g, AvatarMenuComponentCall)
    } else {
      contents = removeLines(contents, [12, 46])
    }

    fs.writeFileSync(`${outputPath}/${fileName}`, contents, 'utf8')
  }
})

module.exports = ({
  fullFilePath,
  templatePath,
  stubsPath,
  outputPath,
  fileName,
  hasAuthentication
}) => {
  const relativePath = fullFilePath.replace(templatePath, '')
  if (Object.values(RELATIVE_PATHS).includes(relativePath)) {
    actions({
      relativePath,
      stubsPath,
      outputPath,
      fileName
    })[relativePath]({ hasAuthentication })
  }
}