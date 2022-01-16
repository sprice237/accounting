import { TransactionItemsRepository, UnitOfWork } from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['Transaction'] = {
  async items(transaction) {
    const uow = new UnitOfWork();
    const transactionItems = await uow
      .getRepo(TransactionItemsRepository)
      .getAllForTransaction(transaction.id);
    return transactionItems.map((transactionItem) => ({
      ...transactionItem,
      account: undefined!,
      transaction: undefined!,
    }));
  },
};
