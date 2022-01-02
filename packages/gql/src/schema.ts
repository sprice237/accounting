import { gql } from '@apollo/client/core';
import { GraphQLScalarType, GraphQLSchema, Kind } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import Big from 'big.js';

export const getSchema = (gqlSchema: string): GraphQLSchema => {
  // GraphQL Schema definition.
  const typeDefs = gql`
    ${gqlSchema}
  `;

  const resolvers = {
    Date: new GraphQLScalarType({
      name: 'Date',
      serialize: (parsed: Date | null): string | null => parsed && parsed.toISOString(),
      parseValue: (raw: any): Date | null => raw && new Date(raw),
      parseLiteral(ast): Date | null {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
          return new Date(ast.value);
        }
        return null;
      },
    }),
    Money: new GraphQLScalarType({
      name: 'Money',
      serialize: (parsed: Big): string => parsed.toString(),
      parseValue: (raw: string): Big => Big(raw),
      parseLiteral(ast): Big {
        if (ast.kind === Kind.STRING) {
          return Big(ast.value);
        }
        throw new Error('Invalid value');
      },
    }),
  };

  // GraphQL Schema, required to use the link
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
};
