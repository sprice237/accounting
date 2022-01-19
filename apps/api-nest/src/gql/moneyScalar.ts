import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import Big from 'big.js';

@Scalar('Money')
export class MoneyScalar implements CustomScalar<string, Big> {
  description = 'Money custom scalar type';

  parseValue(value: unknown): Big {
    if (typeof value !== 'string') {
      throw new Error('invalid value');
    }
    return Big(value);
  }

  serialize(value: unknown): string {
    if (!(value instanceof Big)) {
      throw new Error('invalid value');
    }
    return value.toString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Big {
    if (ast.kind === Kind.STRING) {
      return Big(ast.value);
    }
    throw new Error('invalid value');
  }
}