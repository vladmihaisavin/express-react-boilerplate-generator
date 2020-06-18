const os = require('os')

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

const addSpaces = (occurences) => {
  let result = ''
  for (let i = 0; i < occurences; ++i) {
    result += ' '
  }
  return result
}

const newLineWithTabs = (tabNo) => `${os.EOL}${addTabs(tabNo)}`

module.exports = {
  removeLines,
  addTabs,
  addSpaces,
  newLineWithTabs
}