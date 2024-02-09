// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require ("dotenv").config();
import {Knex} from "knex";
import path from "path";

const {
  DATABASE_URL="postgresql://postgres@localhost/postgres",
  DATABASE_URL_DEVELOPMENT="postgresql://postgres@localhost/postgres",
} = process.env;

// console.log("DATABASE_URL",DATABASE_URL)
// console.log("DATABASE_URL_DEVELOPMENT",DATABASE_URL_DEVELOPMENT)
// console.log("process.env", process.env)

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
