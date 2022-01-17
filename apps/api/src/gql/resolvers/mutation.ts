import { AccountTypeEnum } from '@sprice237/accounting-gql';
import {
  AccountsRepository,
  TransactionsRepository,
  TransactionItemsRepository,
  UnitOfWork,
  AccountRelationshipsRepository,
} from '@sprice237/accounting-db';

import { AppResolvers } from '.';
import { ForbiddenError } from 'apollo-server-express';
import { assert } from '@sprice237/accounting-utils';

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
  async setAccountParent(_, { accountId, parentAccountId }, { assertPortfolio }) {
    const { id: portfolioId } = assertPortfolio();

    const uow = new UnitOfWork();
    const account = await uow.getRepo(AccountsRepository).getById(accountId);
    if (account?.portfolioId !== portfolioId) {
      throw new ForbiddenError('Account not found');
    }

    await uow.executeTransaction(async () => {
      await uow.getRepo(AccountRelationshipsRepository).delete(accountId);

      if (parentAccountId) {
        await uow.getRepo(AccountRelationshipsRepository).create({
          accountId,
          parentAccountId,
        });
      }
    });

    return true;
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
  async categorizeTransactionItems(_, { transactionItemIds, accountId }, { assertPortfolio }) {
    const { id: portfolioId } = assertPortfolio();

    const uow = new UnitOfWork();
    await uow.executeTransaction(async () => {
      for (const transactionItemId of transactionItemIds) {
        const transactionItem = await uow
          .getRepo(TransactionItemsRepository)
          .getById(transactionItemId);

        if (!transactionItem) {
          throw new Error('not found');
        }

        if (transactionItem.transactionId) {
          const transactionId = transactionItem.transactionId;

          const transactionItemsForTransaction = await uow
            .getRepo(TransactionItemsRepository)
            .getAllForTransaction(transactionId);

          const otherTransactionItems = transactionItemsForTransaction.filter(
            ({ id }) => id !== transactionItem.id
          );

          if (otherTransactionItems.length > 1) {
            throw new Error('unsupported for complex transactions');
          }

          const [otherTransactionItem] = otherTransactionItems;

          if (otherTransactionItem) {
            const account = await uow
              .getRepo(AccountsRepository)
              .getById(otherTransactionItem.accountId);

            assert(account);

            if (account.type !== 'INCOME' && account.type !== 'EXPENSE') {
              throw new Error('unsupported for account types other than INCOME and EXPENSE');
            }

            await uow.getRepo(TransactionItemsRepository).delete(otherTransactionItem.id);
          }

          transactionItem.transactionId = null;
          await uow.getRepo(TransactionItemsRepository).update(transactionItem.id, transactionItem);

          await uow.getRepo(TransactionsRepository).delete(transactionId);
        }

        const transaction = await uow.getRepo(TransactionsRepository).create({
          portfolioId,
        });

        transactionItem.transactionId = transaction.id;

        await uow.getRepo(TransactionItemsRepository).update(transactionItem.id, transactionItem);

        await uow.getRepo(TransactionItemsRepository).create({
          accountId,
          amount: transactionItem.amount.mul(-1),
          date: transactionItem.date,
          description: transactionItem.description,
          transactionId: transactionItem.transactionId,
        });
      }
    });

    return true;
  },
  async uncategorizeTransactionItems(_, { transactionItemIds }) {
    const uow = new UnitOfWork();
    await uow.executeTransaction(async () => {
      for (const transactionItemId of transactionItemIds) {
        const transactionItem = await uow
          .getRepo(TransactionItemsRepository)
          .getById(transactionItemId);

        if (!transactionItem) {
          throw new Error('not found');
        }

        if (transactionItem.transactionId) {
          const transactionId = transactionItem.transactionId;

          const transactionItemsForTransaction = await uow
            .getRepo(TransactionItemsRepository)
            .getAllForTransaction(transactionId);

          const otherTransactionItems = transactionItemsForTransaction.filter(
            ({ id }) => id !== transactionItem.id
          );

          if (otherTransactionItems.length > 1) {
            throw new Error('unsupported for complex transactions');
          }

          const [otherTransactionItem] = otherTransactionItems;

          if (otherTransactionItem) {
            const account = await uow
              .getRepo(AccountsRepository)
              .getById(otherTransactionItem.accountId);

            assert(account);

            if (account.type !== 'INCOME' && account.type !== 'EXPENSE') {
              throw new Error('unsupported for account types other than INCOME and EXPENSE');
            }

            await uow.getRepo(TransactionItemsRepository).delete(otherTransactionItem.id);
          }

          transactionItem.transactionId = null;
          await uow.getRepo(TransactionItemsRepository).update(transactionItem.id, transactionItem);

          await uow.getRepo(TransactionsRepository).delete(transactionId);
        }
      }
    });

    return true;
  },
};
