import { useState, VFC } from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { AccountFragment, AccountTypeEnum, useAccountsQuery } from '@sprice237/accounting-gql';

type CategorizeTransactionMenuAccountListProps = {
  accountType: AccountTypeEnum;
  onGoBack: () => void;
  onAccountSelected: (account: AccountFragment) => void;
};

export const CategorizeTransactionMenuAccountList: VFC<CategorizeTransactionMenuAccountListProps> =
  ({ accountType, onGoBack, onAccountSelected }) => {
    const [accountStack, setAccountStack] = useState<AccountFragment[]>([]);

    const { data: { accounts } = { accounts: undefined } } = useAccountsQuery({
      variables: {
        input: {
          types: [accountType],
        },
      },
    });

    const hasChildren = (account: AccountFragment) => {
      return (accounts ?? []).some((_account) => _account.parent?.id === account.id);
    };

    const parentAccount = accountStack[accountStack.length - 1];

    const filteredAccounts = (accounts ?? []).filter(
      (account) => account.parent?.id === parentAccount?.id
    );

    const accountSelected = (account: AccountFragment) => {
      const accountHasChildren = hasChildren(account);
      if (accountHasChildren) {
        setAccountStack((oldAccountStack) => [...oldAccountStack, account]);
      } else {
        onAccountSelected(account);
      }
    };

    const goBack = () => {
      if (!accountStack.length) {
        onGoBack();
      } else {
        setAccountStack((oldAccountStack) => oldAccountStack.slice(0, -1));
      }
    };

    return (
      <MenuList>
        <MenuItem onClick={goBack}>&lt; Back</MenuItem>
        {parentAccount && (
          <MenuItem onClick={() => onAccountSelected(parentAccount)}>{parentAccount.name}</MenuItem>
        )}
        {filteredAccounts.map((account) => (
          <MenuItem key={account.id} onClick={() => accountSelected(account)}>
            {account.name}
            {hasChildren(account) && ' >'}
          </MenuItem>
        ))}
      </MenuList>
    );
  };
