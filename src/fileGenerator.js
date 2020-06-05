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

const addTabs = (occurences) => {
  let result = ''
  for (let i = 0; i < occurences; ++i) {
    result += '\t'
  }
  return result
}

const actions = ({
  relativePath,
  stubsPath,
  outputPath,
  fileName
}) => {
  const readFile = () => fs.readFileSync(path.join(stubsPath, `${relativePath}.stub`), 'utf8')
  const writeFile = (content) => fs.writeFileSync(`${outputPath}/${fileName}`, content, 'utf8')

  return {
    [RELATIVE_PATHS.CLIENT_HEADER]: ({ hasAuthentication }) => {
      const AvatarMenuImport = `import AvatarMenu from './AvatarMenu.jsx'`
      const AvatarMenuComponentCall = `<Grid item>${os.EOL}${addTabs(7)}<AvatarMenu />${os.EOL}${addTabs(6)}</Grid>`
  
      let content = readFile()
      if (hasAuthentication) {
        content = content.replace(/###AvatarMenuImport###/g, AvatarMenuImport)
        content = content.replace(/###AvatarMenuComponentCall###/g, AvatarMenuComponentCall)
      } else {
        content = removeLines(content, [12, 46])
      }
      writeFile(content)
    }
  }
}

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