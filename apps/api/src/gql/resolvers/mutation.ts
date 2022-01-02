import { AccountTypeEnum, TransactionItemTypeEnum } from '@sprice237/accounting-gql';
import {
  AccountsRepository,
  TransactionsRepository,
  TransactionItemsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['Mutation'] = {
  async createAccount(_, { input }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const uow = new UnitOfWork();
    const account = await uow.getRepo(AccountsRepository).create({
      ...input,
      portfolioId: portfolio.id,
    });
    return {
      ...account,
      type: account.type as AccountTypeEnum,
    };
  },
  async createTransaction(_1, { input }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const { items, ...transactionInput } = input;

    const uow = new UnitOfWork();

    const transaction = await uow.executeTransaction(async () => {
      const transaction = await uow.getRepo(TransactionsRepository).create({
        ...transactionInput,
        portfolioId: portfolio.id,
      });

      await Promise.all(
        (items ?? []).map((item) =>
          uow.getRepo(TransactionItemsRepository).create({
            ...item,
            transactionId: transaction.id,
            description: item.description ?? null,
          })
        )
      );

      return transaction;
    });

    return {
      ...transaction,
      items: undefined!,
    };
  },
  async createTransactionItem(_, { input }) {
    const uow = new UnitOfWork();
    const transactionItem = await uow.getRepo(TransactionItemsRepository).create({
      ...input,
      description: input.description ?? null,
    });
    return {
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
      type: transactionItem.type as TransactionItemTypeEnum,
    };
  },
};
