
const env = process.env.NODE_ENV || "development";
import { Knex } from "knex";
import config from "../../knexfile";

// const config = require("../../knexfile")[env];
const knex: Knex = require("knex")(config[env])
export default knex;