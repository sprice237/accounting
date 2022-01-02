import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

import { AppResolvers } from '.';

export const dateScalarType: AppResolvers['Date'] = new GraphQLScalarType({
  name: 'Date',
  description: 'Date type',
  parseValue: (value: string): Date => new Date(value),
  serialize: (value: Date): string => value.toISOString(),
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('invalid value');
  },
});
