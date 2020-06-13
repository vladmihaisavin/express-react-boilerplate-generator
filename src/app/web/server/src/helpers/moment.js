const moment = require('moment')

const getCurrentTimestamp = () => moment().format('YYYY-MM-DD hh:mm:ss')

module.exports = {
  getCurrentTimestamp
}