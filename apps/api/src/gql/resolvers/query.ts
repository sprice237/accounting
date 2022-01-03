import Big from 'big.js';
import { AccountTypeEnum, TransactionItemTypeEnum } from '@sprice237/accounting-gql';
import {
  AccountsRepository,
  TransactionsRepository,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['Query'] = {
  async accounts(_1, { input }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const types = input?.types ?? undefined;

    const uow = new UnitOfWork();
    const accounts = await uow.getRepo(AccountsRepository).getAllForPortfolio(portfolio.id, types);
    return accounts.map((account) => ({
      ...account,
      type: account.type as AccountTypeEnum,
    }));
  },
  async transactions(_1, _2, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const uow = new UnitOfWork();
    const transactions = await uow.getRepo(TransactionsRepository).getAllForPortfolio(portfolio.id);
    return transactions.map((transaction) => ({
      ...transaction,
      items: undefined!,
    }));
  },
  async transactionItemsForAccount(_, { input: { accountId, startDate, endDate } }) {
    const uow = new UnitOfWork();
    const transactionItems = await uow
      .getRepo(TransactionItemsRepository)
      .getAllForAccount(accountId, startDate ?? undefined, endDate ?? undefined);
    return transactionItems.map((transactionItem) => ({
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
      type: transactionItem.type as TransactionItemTypeEnum,
    }));
  },
  async transactionItemsReportForAccount(_, { input: { accountId, startDate, endDate } }) {
    const uow = new UnitOfWork();

    const transactionItems = await uow
      .getRepo(TransactionItemsRepository)
      .getAllForAccount(accountId, startDate ?? undefined, endDate ?? undefined);
    const { sumDebits, sumCredits } = await uow
      .getRepo(TransactionItemsRepository)
      .getAggregationForAccount(accountId, startDate ?? undefined, endDate ?? undefined);

    const { sumDebits: priorSumDebits, sumCredits: priorSumCredits } = startDate
      ? await uow
          .getRepo(TransactionItemsRepository)
          .getAggregationForAccount(accountId, undefined, startDate)
      : { sumDebits: Big(0), sumCredits: Big(0) };

    return {
      items: transactionItems.map((transactionItem) => ({
        ...transactionItem,
        account: undefined!,
        transaction: undefined!,
        type: transactionItem.type as TransactionItemTypeEnum,
      })),
      sumDebits,
      sumCredits,
      priorSumDebits,
      priorSumCredits,
    };
  },
};
