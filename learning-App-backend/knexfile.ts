// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require ("dotenv").config();
import {Knex} from "knex";
import path from "path";

const {
  DATABASE_URL="postgresql://postgres:postgres@database/postgres",
  DATABASE_URL_DEVELOPMENT="postgresql://postgres:postgres@database/postgres",
} = process.env;

const config: Record<string, Knex.Config> = {

  development: {
    client: 'postgresql',
    connection: DATABASE_URL_DEVELOPMENT,
    pool:{
      min: 1,
      max: 5
    },
    migrations:{
      directory:path.join(__dirname,"src","db", "migrations")
    }
  },

  production: {
    client: 'postgresql',
    connection: DATABASE_URL,
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory:path.join(__dirname, "src","db", "migrations")
    }
  }

};
export default config;
