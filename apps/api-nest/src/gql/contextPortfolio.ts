import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Portfolio } from '@sprice237/accounting-db';

export const ContextPortfolio = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext();
    return gqlContext.auth?.portfolio as Portfolio;
  }
)