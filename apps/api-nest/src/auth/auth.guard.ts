import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PortfoliosRepository } from '@sprice237/accounting-db';
import { DatabaseService } from '../db/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (@Inject(DatabaseService) private databaseService: DatabaseService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const portfolioId = gqlContext.req.headers['x-portfolio-id'];

    const uow = this.databaseService.createUnitOfWork();
    const portfolio =
      portfolioId && !Array.isArray(portfolioId)
        ? await uow.getRepo(PortfoliosRepository).getById(portfolioId)
        : undefined;

    gqlContext.auth = {
      portfolio
    }
    
    return !!portfolio;
  }
}
