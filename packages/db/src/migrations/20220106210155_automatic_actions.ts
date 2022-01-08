import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('automaticActionTypes', (table) => {
    table.text('type').primary();
    table.timestamps(true, true);
  });

  await knex('automaticActionTypes').insert([
    { type: 'CREATE_NEW_TRANSACTION' },
    { type: 'LINK_EXISTING_TRANSACTION_ITEM' },
  ]);

  await knex.schema.createTable('automaticActions', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('portfolioId').notNullable().references('id').inTable('portfolios');
    table.integer('orderIndex').notNullable();
    table.text('type').notNullable().references('type').inTable('automaticActionTypes');
    table.timestamps(true, true);
    table.unique(['portfolioId', 'orderIndex']);
  });

  await knex.schema.createTable('transactionItemFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
  });

  await knex.schema.createTable('accountFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.uuid('accountId').notNullable().references('id').inTable('accounts').onDelete('CASCADE');
  });

  await knex.schema.createTable('descriptionFilterTypes', (table) => {
    table.text('type').primary();
    table.timestamps(true, true);
  });

  await knex('descriptionFilterTypes').insert([
    { type: 'STARTS_WITH' },
    { type: 'ENDS_WITH' },
    { type: 'CONTAINS' },
  ]);

  await knex.schema.createTable('descriptionFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.text('type').notNullable().references('type').inTable('descriptionFilterTypes');
    table.text('text').notNullable();
  });

  await knex.schema.createTable('transactionItemTypeFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.enum('type', ['CREDIT', 'DEBIT']).notNullable();
  });

  await knex.schema.createTable('numericFilterTypes', (table) => {
    table.text('type').primary();
    table.timestamps(true, true);
  });

  await knex('numericFilterTypes').insert([
    { type: 'lt' },
    { type: 'lte' },
    { type: 'gt' },
    { type: 'gte' },
    { type: 'eq' },
    { type: 'neq' },
  ]);

  await knex.schema.createTable('amountFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.text('type').notNullable().references('type').inTable('numericFilterTypes');
    table.decimal('amount', 16, 4);
  });

  await knex.schema.createTable('relativeTimeSpanFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.specificType('span', 'interval').notNullable();
  });

  await knex.schema.createTable('dateFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
    table.text('type').notNullable().references('type').inTable('numericFilterTypes');
    table.timestamp('date').notNullable();
  });

  await knex.schema.createTable('automaticActionSourceFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('automaticActionId')
      .notNullable()
      .references('id')
      .inTable('automaticActions')
      .onDelete('CASCADE');
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
  });

  await knex.schema.createTable('automaticActionNewTransactionAccounts', (table) => {
    table
      .uuid('automaticActionId')
      .notNullable()
      .references('id')
      .inTable('automaticActions')
      .onDelete('CASCADE')
      .primary();
    table.uuid('accountId').notNullable().references('id').inTable('accounts').onDelete('CASCADE');
  });

  await knex.schema.createTable('automaticActionExistingTransactionFilters', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table
      .uuid('automaticActionId')
      .notNullable()
      .references('id')
      .inTable('automaticActions')
      .onDelete('CASCADE');
    table
      .uuid('transactionItemFilterId')
      .notNullable()
      .references('id')
      .inTable('transactionItemFilters')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('automaticActionExistingTransactionFilters');
  await knex.schema.dropTable('automaticActionNewTransactionAccounts');
  await knex.schema.dropTable('automaticActionSourceFilters');
  await knex.schema.dropTable('dateFilters');
  await knex.schema.dropTable('relativeTimeSpanFilters');
  await knex.schema.dropTable('amountFilters');
  await knex.schema.dropTable('numericFilterTypes');
  await knex.schema.dropTable('transactionItemTypeFilters');
  await knex.schema.dropTable('descriptionFilters');
  await knex.schema.dropTable('descriptionFilterTypes');
  await knex.schema.dropTable('accountFilters');
  await knex.schema.dropTable('transactionItemFilters');
  await knex.schema.dropTable('automaticActions');
  await knex.schema.dropTable('automaticActionTypes');
}
