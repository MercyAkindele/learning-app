import app from "./app";
import { Knex } from "knex";
import knex from "./db/connection";
const {PORT = 8080} = process.env;

knex.migrate
  .latest()
  .then((migrations: Knex.Migration[]) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch((error:Error) => {
    console.error(error);
    knex.destroy();
  });

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
