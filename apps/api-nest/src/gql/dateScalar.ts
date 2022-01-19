import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new Error('invalid value');
    }
    return new Date(value); // value from the client
  }

  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error('invalid value');
    }
    return value.toISOString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('invalid value');
  }
}