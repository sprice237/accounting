import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accountRelationships', (table) => {
    table.uuid('accountId').references('id').inTable('accounts').primary();
    table.uuid('parentAccountId').notNullable().references('id').inTable('accounts');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accountRelationships');
}
