import { AccountTypeEnum } from '@sprice237/accounting-gql';
import {
  AccountsRepository,
  AccountRelationshipsRepository,
  UnitOfWork,
} from '@sprice237/accounting-db';

import { AppResolvers } from '.';

export const resolvers: AppResolvers['Account'] = {
  async parent({ id: accountId }) {
    const uow = new UnitOfWork();
    const accountRelationship = await uow
      .getRepo(AccountRelationshipsRepository)
      .getById(accountId);

    if (!accountRelationship) {
      return null;
    }

    const parentAccount = await uow
      .getRepo(AccountsRepository)
      .getById(accountRelationship.parentAccountId);

    if (!parentAccount) {
      throw new Error('not found');
    }

    return {
      ...parentAccount,
      type: parentAccount.type as AccountTypeEnum,
    };
  },
};
