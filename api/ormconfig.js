const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

const nodeEnv = process.env.NODE_ENV
const envPath = path.join(__dirname, 'env', nodeEnv)
const migFldr =
  nodeEnv === 'development' || nodeEnv === 'testing' ? 'development' : nodeEnv

const client = path.join(envPath, '.env.client')
if (fs.existsSync(client)) {
  dotenv.config({ path: client })
} else {
  throw new Error(`File does not exist: ${client}`)
}

const admin = path.join(envPath, '.env.admin')
if (fs.existsSync(admin)) {
  dotenv.config({ path: admin })
} else {
  throw new Error(`File does not exist: ${admin}`)
}

const db = path.join(envPath, '.env.db')
if (fs.existsSync(db)) {
  dotenv.config({ path: db })
} else {
  throw new Error(`File does not exist: ${db}`)
}

module.exports = [
  {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['libs/database/src/entity/**/*.ts'],
    migrations: [
      `libs/database/src/migration/${migFldr}/**/*.ts`,
      'libs/database/src/migration/privileges/**/*.ts',
      'libs/database/src/migration/policies/**/*.ts',
      'libs/database/src/migration/roles/**/*.ts',
    ],
    cli: {
      entitiesDir: 'libs/database/src/entity',
      migrationsDir: `libs/database/src/migration/${migFldr}`,
      subscribersDir: 'libs/database/src/subscriber',
    },
  },
]
