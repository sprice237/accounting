import { AccountTypeEnum } from '@sprice237/accounting-gql';
import { AccountsRepository, TransactionsRepository, UnitOfWork } from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['TransactionItem'] = {
  async account(transactionItem) {
    const uow = new UnitOfWork();
    const account = await uow.getRepo(AccountsRepository).getById(transactionItem.accountId);

    if (!account) {
      throw new Error('not found');
    }

    return {
      ...account,
      type: account.type as AccountTypeEnum,
    };
  },
  async transaction(transactionItem) {
    const uow = new UnitOfWork();
    const transaction = await uow
      .getRepo(TransactionsRepository)
      .getById(transactionItem.transactionId);

    if (!transaction) {
      throw new Error('not found');
    }

    return {
      ...transaction,
      items: undefined!,
    };
  },
};
