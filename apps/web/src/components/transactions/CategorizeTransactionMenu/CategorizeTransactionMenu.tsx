import { useState, VFC } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {
  AccountFragment,
  AccountTypeEnum,
  TransactionItemFragment,
  useCategorizeTransactionItemMutation,
} from '@sprice237/accounting-gql';
import { CategorizeTransactionMenuAccountList } from './CategorizeTransactionMenuAccountList';

type CategorizeTransactionMenuProps = {
  transactionItem: TransactionItemFragment;
  referenceElement: HTMLElement;
  onLaunchEditor: () => void;
  onClose: () => void;
};

export const CategorizeTransactionMenu: VFC<CategorizeTransactionMenuProps> = ({
  transactionItem,
  referenceElement,
  onLaunchEditor,
  onClose,
}) => {
  const [accountType, setSelectedAccountType] = useState<AccountTypeEnum>();
  const clearSelectedAccountType = () => setSelectedAccountType(undefined);

  const [categorizeTransactionItem] = useCategorizeTransactionItemMutation();

  const onAccountSelected = async (account: AccountFragment) => {
    await categorizeTransactionItem({
      variables: {
        transactionItemId: transactionItem.id,
        accountId: account.id,
      },
    });
    onClose();
  };

  return (
    <Menu anchorEl={referenceElement} open onClose={onClose}>
      {!accountType && (
        <MenuList>
          <MenuItem onClick={() => setSelectedAccountType(AccountTypeEnum.Income)}>
            Income &gt;
          </MenuItem>
          <MenuItem onClick={() => setSelectedAccountType(AccountTypeEnum.Expense)}>
            Expense &gt;
          </MenuItem>
          <MenuItem onClick={onLaunchEditor}>Edit</MenuItem>
        </MenuList>
      )}
      {accountType && (
        <CategorizeTransactionMenuAccountList
          accountType={accountType}
          onGoBack={clearSelectedAccountType}
          onAccountSelected={onAccountSelected}
        />
      )}
    </Menu>
  );
};
