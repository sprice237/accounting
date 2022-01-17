import { useState, VFC } from 'react';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { AccountTypeEnum, AccountFragment } from '@sprice237/accounting-gql';
import { CategorizeTransactionMenuAccountList } from './CategorizeTransactionMenuAccountList';

type CategorizeTransactionMenuProps = {
  referenceElement: HTMLElement;
  onLaunchEditor?: () => void;
  onSelect: (account: AccountFragment | null) => void;
  onClose: () => void;
};

export const CategorizeTransactionMenu: VFC<CategorizeTransactionMenuProps> = ({
  referenceElement,
  onLaunchEditor,
  onSelect,
  onClose,
}) => {
  const [accountType, setSelectedAccountType] = useState<AccountTypeEnum>();
  const clearSelectedAccountType = () => setSelectedAccountType(undefined);

  return (
    <Popover anchorEl={referenceElement} open onClose={onClose}>
      {!accountType && (
        <MenuList>
          <MenuItem onClick={onClose}>&lt; Cancel</MenuItem>
          <MenuItem onClick={() => onSelect(null)}>Uncategorized</MenuItem>
          <MenuItem onClick={() => setSelectedAccountType(AccountTypeEnum.Income)}>
            Income &gt;
          </MenuItem>
          <MenuItem onClick={() => setSelectedAccountType(AccountTypeEnum.Expense)}>
            Expense &gt;
          </MenuItem>
          {onLaunchEditor && <MenuItem onClick={onLaunchEditor}>Edit</MenuItem>}
        </MenuList>
      )}
      {accountType && (
        <CategorizeTransactionMenuAccountList
          accountType={accountType}
          onGoBack={clearSelectedAccountType}
          onAccountSelected={onSelect}
        />
      )}
    </Popover>
  );
};
