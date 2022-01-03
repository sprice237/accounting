import { AccountTypeEnum } from '@sprice237/accounting-gql';
import { AccountsRepository, UnitOfWork } from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['BalanceSheetReportAccount'] = {
  async account({ accountId }) {
    const uow = new UnitOfWork();
    const account = await uow.getRepo(AccountsRepository).getById(accountId);

    if (!account) {
      throw new Error('not found');
    }

    return {
      ...account,
      type: account.type as AccountTypeEnum,
    };
  },
};
