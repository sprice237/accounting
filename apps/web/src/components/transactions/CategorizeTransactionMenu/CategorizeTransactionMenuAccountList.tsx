import { VFC } from 'react';
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
    const { data: { accounts } = { accounts: undefined } } = useAccountsQuery({
      variables: {
        input: {
          types: [accountType],
        },
      },
    });

    return (
      <MenuList>
        <MenuItem onClick={onGoBack}>&lt; Back</MenuItem>
        {(accounts ?? []).map((account) => (
          <MenuItem key={account.id} onClick={() => onAccountSelected(account)}>
            {account.name}
          </MenuItem>
        ))}
      </MenuList>
    );
  };
