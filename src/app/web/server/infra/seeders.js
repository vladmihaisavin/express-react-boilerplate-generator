const { hashPassword } = require('../src/helpers/bcrypt')
const { getCurrentTimestamp } = require('../src/helpers/moment')

module.exports = async () => ([
  {
    tableName: 'users',
    record: {
      type: 'admin',
      name: 'vlad',
      email: 'savin.vladmihai@gmail.com',
      password: await hashPassword('asd123'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
  },
  {
    tableName: 'users',
    record: {
      type: 'guest',
      name: 'mama',
      email: 'mama@mail.com',
      password: await hashPassword('asd123'),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
  }
])