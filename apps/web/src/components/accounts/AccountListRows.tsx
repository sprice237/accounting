import { VFC } from 'react';
import { useAccountsQuery, AccountTypeEnum } from '@sprice237/accounting-gql';

import { AccountListRow } from './AccountListRow';

type AccountListRowsProps = {
  accountType: AccountTypeEnum;
  parentAccountId: string | null;
  indentLevel?: number;
};

export const AccountListRows: VFC<AccountListRowsProps> = ({
  accountType,
  parentAccountId,
  indentLevel = 0,
}) => {
  const { data: { accounts } = {} } = useAccountsQuery({
    variables: {
      input: {
        types: [accountType],
      },
    },
  });

  const filteredAccounts = (accounts ?? []).filter(
    (account) => (account.parent?.id ?? null) === parentAccountId
  );

  return (
    <>
      {filteredAccounts.map((account) => (
        <AccountListRow key={account.id} account={account} indentLevel={indentLevel} />
      ))}
    </>
  );
};
