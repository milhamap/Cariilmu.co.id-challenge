// Update with your config settings.
require('dotenv').config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: 'utc',
      charset: 'utf8mb4'
    },
    port: process.env.DB_PORT,
    migrations: {
      directory: './src/databases/migrations'
    },
    seeds: {
      directory: './src/databases/seeds'
    }
  },

  production: {
    client: '',
    connection: {
      database: '',
      user:     '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: ''
    }
  }

};
