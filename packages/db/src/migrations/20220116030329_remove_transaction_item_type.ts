import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw("UPDATE ?? SET amount = amount * -1 WHERE type = 'DEBIT';", ['transactionItems']);

  await knex.schema.alterTable('transactionItems', (table) => {
    table.dropColumn('type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactionItems', (table) => {
    table.enum('type', ['DEBIT', 'CREDIT']);
  });

  await knex.raw("UPDATE ?? SET type = 'DEBIT', amount = amount * -1 WHERE amount < 0;", [
    'transactionItems',
  ]);
}
