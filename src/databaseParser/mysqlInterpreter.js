
const MYSQL_TYPES_TO_JOI = {
  'varchar(255)': '.string()',
  'int': '.number().integer()',
  'timestamp': '.date()',
  'boolean': '.boolean()'
}

const MYSQL_TYPES_TO_SWAGGER = {
  'varchar(255)': {
    type: 'string'
  },
  'int': {
    type: 'integer',
    format: 'int64'
  },
  'timestamp': {
    type: "string",
    format: "date-time"
  },
  'boolean': {
    type: "boolean"
  }
}

const MYSQL_TYPES_TO_RAW = {
  'varchar(255)': 'VARCHAR(255)',
  'int': 'INT',
  'timestamp': 'TIMESTAMP',
  'boolean': 'BOOLEAN',
  'nullable_false': 'NOT NULL',
  'auto_increment': 'AUTO INCREMENT',
  'key_PRI': 'PRIMARY KEY',
}

const reconstructRawType = (field) => {
  const particles = []
  particles.push(`${MYSQL_TYPES_TO_RAW[field.type]}`)
  if (field.extra) {
    particles.push(`${MYSQL_TYPES_TO_RAW[field.extra]}`)
  }
  if (field.nullable === false) {
    if (!field.key) {
      particles.push(`${MYSQL_TYPES_TO_RAW['nullable_false']}`)
    } else {
      particles.push(`${MYSQL_TYPES_TO_RAW['key_' + field.key]}`)
    }
  }
  if (field.default) {
    particles.push(`DEFAULT \"${field.default}\"`)
  }
  return particles.join(' ')
}

module.exports = {
  MYSQL_TYPES_TO_JOI,
  MYSQL_TYPES_TO_SWAGGER,
  reconstructRawType
}