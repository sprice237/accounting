import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('portfolios', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.text('name').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('accounts', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('portfolioId').notNullable().references('id').inTable('portfolios');
    table.text('name').notNullable();
    table.enum('type', ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('portfolioId').notNullable().references('id').inTable('portfolios');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('transactionItems', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('transactionId').references('id').inTable('transactions');
    table.uuid('accountId').notNullable().references('id').inTable('accounts');
    table.timestamp('date').notNullable();
    table.enum('type', ['DEBIT', 'CREDIT']);
    table.decimal('amount', 16, 4);
    table.text('description');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactionItems');
  await knex.schema.dropTable('transactions');
  await knex.schema.dropTable('accounts');
  await knex.schema.dropTable('portfolios');
}
