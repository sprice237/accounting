import { Query, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { AccountWithTimestamps, AccountsRepository, Portfolio } from '@sprice237/accounting-db';
import * as gqlSchema from '@sprice237/accounting-gql';
import { DatabaseService } from '../db/database.service';
import { AuthGuard } from "../auth/auth.guard";
import { ContextPortfolio } from '../gql/contextPortfolio';

export const mapDbAccountToGqlAccount   = (dbAccount: AccountWithTimestamps): gqlSchema.Account => {
  return {
    ...dbAccount,
    type: dbAccount.type as gqlSchema.AccountTypeEnum,
  };
}

@Resolver('Account')
export class AccountsResolver {
  constructor(@Inject(DatabaseService) private databaseService: DatabaseService) {}
  
  @Query('accounts')
  @UseGuards(AuthGuard)
  async getAccounts(@ContextPortfolio() portfolio: Portfolio): Promise<gqlSchema.Account[]> {
    const uow = this.databaseService.createUnitOfWork();
    const accounts = await uow.getRepo(AccountsRepository).getAllForPortfolio(portfolio.id);
    return accounts.map(account => mapDbAccountToGqlAccount(account));
  }
}