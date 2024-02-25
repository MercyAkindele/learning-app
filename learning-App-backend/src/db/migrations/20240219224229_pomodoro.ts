import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("pomodoro", (table)=>{
        table.increments("pomodoro_id").primary();
        table.string("user_id").notNullable();
        table.string("subject");
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("pomodoro");
}
