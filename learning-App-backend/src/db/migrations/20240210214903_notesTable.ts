import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("notes", (table) => {
    table.increments("notes_id");
    table.string("user_id").notNullable();
    table.text("note_content").notNullable();
    table
      .integer("subject_id")
      .references("subject_id")
      .inTable("subject")
      .defaultTo(null);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("notes");
}
