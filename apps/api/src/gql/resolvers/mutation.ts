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
        (items ?? []).map(({ id: itemId, ...item }) => {
          if (!itemId) {
            return uow.getRepo(TransactionItemsRepository).create({
              ...item,
              transactionId: transaction.id,
              description: item.description ?? null,
            });
          } else {
            return uow.getRepo(TransactionItemsRepository).update(itemId, {
              ...item,
              transactionId: transaction.id,
              description: item.description ?? null,
            });
          }
        })
      );

      return transaction;
    });

    return {
      ...transaction,
      items: undefined!,
    };
  },
  async updateTransaction(_1, { transactionId, input }, { assertPortfolio }) {
    const portfolio = assertPortfolio();

    const { items, ...transactionInput } = input;

    const uow = new UnitOfWork();

    const transaction = await uow.executeTransaction(async () => {
      const transaction = await uow.getRepo(TransactionsRepository).update(transactionId, {
        ...transactionInput,
        portfolioId: portfolio.id,
      });

      if (!transaction) {
        throw Error('not found');
      }

      const existingTransactionItems = await uow
        .getRepo(TransactionItemsRepository)
        .getAllForTransaction(transaction.id);

      await Promise.all(
        items.map(({ id: itemId, ...item }) => {
          if (!itemId) {
            return uow.getRepo(TransactionItemsRepository).create({
              ...item,
              transactionId: transaction.id,
              description: item.description ?? null,
            });
          } else {
            return uow.getRepo(TransactionItemsRepository).update(itemId, {
              ...item,
              transactionId: transaction.id,
              description: item.description ?? null,
            });
          }
        })
      );

      const removedTransactionItems = existingTransactionItems.filter(
        (existingTransactionItem) => !items.map(({ id }) => id).includes(existingTransactionItem.id)
      );

      await Promise.all(
        removedTransactionItems.map(async (removedTransactionItem) => {
          return uow.getRepo(TransactionItemsRepository).update(removedTransactionItem.id, {
            ...removedTransactionItem,
            transactionId: null,
          });
        })
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
      transactionId: input.transactionId ?? null,
      description: input.description ?? null,
    });
    return {
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
      type: transactionItem.type as TransactionItemTypeEnum,
    };
  },
  async updateTransactionItem(_, { transactionItemId, input }) {
    const uow = new UnitOfWork();

    const transactionItem = await uow
      .getRepo(TransactionItemsRepository)
      .update(transactionItemId, {
        ...input,
        description: input.description ?? null,
      });

    if (!transactionItem) {
      throw new Error('not found');
    }

    return {
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
      type: transactionItem.type as TransactionItemTypeEnum,
    };
  },
  async deleteTransactionItem(_, { transactionItemId }) {
    const uow = new UnitOfWork();

    const transactionItem = await uow.getRepo(TransactionItemsRepository).delete(transactionItemId);

    if (!transactionItem) {
      throw new Error('not found');
    }

    return true;
  },
};
