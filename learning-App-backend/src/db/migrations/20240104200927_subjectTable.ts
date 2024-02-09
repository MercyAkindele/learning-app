import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("subject", (table)=>{
        table.increments("subject_id");
        table.string("subject_name").notNullable();
        table.string("user_id").notNullable();
        table.unique(["user_id", "subject_name"])
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("subject");
}

