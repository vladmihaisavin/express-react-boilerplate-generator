const convict = require('convict')

module.exports = convict({
  app: {
    env: {
      doc: 'The environment that the app is run on.',
      format: ['production', 'local'],
      default: 'production',
      env: 'APP_ENV'
    },
    port: {
      doc: 'The port the app is listening to.',
      format: 'port',
      default: 6606,
      env: 'PORT'
    },
  },
  mysql: {
    host: {
      doc: 'The mysql server instance host address.',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'MYSQL_HOST'
    },
    port: {
      doc: 'The port the mysql server instance is listening to.',
      format: 'port',
      default: 3307,
      env: 'MYSQL_PORT'
    },
    user: {
      doc: 'The username used to connect to the mysql server instance.',
      format: String,
      default: 'myUser',
      env: 'MYSQL_USER'
    },
    password: {
      doc: 'The username password used to connect to the mysql server instance.',
      format: String,
      default: 'asd123',
      env: 'MYSQL_PASSWORD'
    },
    database: {
      doc: 'The database name used to store the app records.',
      format: String,
      default: 'test_db',
      env: 'MYSQL_DATABASE'
    }
  },
  auth: {
    secret: {
      doc: 'Secret key used by passport js to sign the JWT',
      format: String,
      default: 'asd123',
      env: 'AUTH_SECRET'
    },
    expiresIn: {
      doc: 'Token TTL',
      format: Number,
      default: 60 * 60,
      env: 'AUTH_EXPIRES_IN'
    }
  }
}).validate({ allowed: 'strict' })
