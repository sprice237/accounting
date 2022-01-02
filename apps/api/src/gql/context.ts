import { ForbiddenError } from 'apollo-server-express';
import { Request } from 'express';
import { Portfolio, PortfoliosRepository, UnitOfWork } from '@sprice237/accounting-db';

export type Context = {
  portfolio: Portfolio | undefined;
  assertPortfolio: () => Portfolio;
};

export const context = async ({ req }: { req: Request }): Promise<Context> => {
  const portfolioId = req.headers['x-portfolio-id'];

  const uow = new UnitOfWork();

  const portfolio =
    portfolioId && !Array.isArray(portfolioId)
      ? await uow.getRepo(PortfoliosRepository).getById(portfolioId)
      : undefined;

  const assertPortfolio = (): Portfolio => {
    if (!portfolio) {
      throw new ForbiddenError('Portfolio not available');
    }

    return portfolio;
  };

  return {
    portfolio,
    assertPortfolio,
  };
};
