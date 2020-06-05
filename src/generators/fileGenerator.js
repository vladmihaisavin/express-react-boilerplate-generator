const fs = require('fs')
const path = require('path')
const { removeLines, newLineWithTabs } = require('../helpers/fileFormatting')

const RELATIVE_PATHS = {
  CLIENT_HEADER: '/client/src/components/structure/Header.jsx'
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
      const AvatarMenuComponentCall = `<Grid item>${newLineWithTabs(7)}<AvatarMenu />${newLineWithTabs(6)}</Grid>`
  
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