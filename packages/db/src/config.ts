import path from 'path';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import * as Knex from 'knex';

const convertKeysToCamelCase = (obj: { [key: string]: unknown }): { [key: string]: unknown } => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({ ...acc, [camelCase(key)]: value }),
    {}
  );
};

const migrationsDirectory = path.resolve(__dirname, 'migrations');

export const config: Knex.Config = {
  client: 'postgresql',
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: migrationsDirectory,
    loadExtensions: ['.js'],
  },
  postProcessResponse: (result) =>
    Array.isArray(result)
      ? result.map((row) => convertKeysToCamelCase(row))
      : convertKeysToCamelCase(result),
  wrapIdentifier: (value, origImpl) => (value === '*' ? '*' : origImpl(snakeCase(value))),
  ...(process.env['DB_CONFIG_JSON']
    ? {
        connection: JSON.parse(process.env['DB_CONFIG_JSON']),
      }
    : {}),
};
