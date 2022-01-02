import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import Big from 'big.js';

import { AppResolvers } from '.';

export const moneyScalarType: AppResolvers['Money'] = new GraphQLScalarType({
  name: 'Money',
  description: 'Money type',
  parseValue: (value: string): Big => Big(value),
  serialize: (value: Big): string => value.toString(),
  parseLiteral(ast: ValueNode): Big {
    if (ast.kind === Kind.STRING) {
      return Big(ast.value);
    }
    throw new Error('invalid value');
  },
});
