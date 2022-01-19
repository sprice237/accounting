import { useRef, useState, VFC } from 'react';
import Popover, { PopoverActions } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import {
  AccountTypeEnum,
  AccountFragment,
  TransactionItemFragment,
} from '@sprice237/accounting-gql';
import { CategorizeTransactionMenuAccountList } from './CategorizeTransactionMenuAccountList';
import { CategorizeTransactionMenuTransferTransactions } from './CategorizeTransactionMenuTransferTransactions';

type CategorizeTransactionMenuProps = {
  transactionItem?: TransactionItemFragment;
  referenceElement: HTMLElement;
  onLaunchEditor?: () => void;
  onSelectAccount?: (account: AccountFragment) => void;
  onSelectTransferTransactionItem?: (transactionItem: TransactionItemFragment) => void;
  onUncategorize?: () => void;
  onClose: () => void;
};

export const CategorizeTransactionMenu: VFC<CategorizeTransactionMenuProps> = ({
  transactionItem,
  referenceElement,
  onLaunchEditor,
  onSelectAccount,
  onSelectTransferTransactionItem,
  onUncategorize,
  onClose,
}) => {
  const [subMenu, setSubMenu] = useState<
    AccountTypeEnum.Income | AccountTypeEnum.Expense | 'transfer'
  >();
  const popoverActions = useRef<PopoverActions | null>(null);
  const clearSubMenu = () => setSubMenu(undefined);

  return (
    <Popover anchorEl={referenceElement} open onClose={onClose} action={popoverActions}>
      {!subMenu && (
        <MenuList>
          <MenuItem onClick={onClose}>&lt; Cancel</MenuItem>
          {onUncategorize && <MenuItem onClick={onUncategorize}>Uncategorized</MenuItem>}
          {onSelectAccount && (
            <MenuItem onClick={() => setSubMenu(AccountTypeEnum.Income)}>Income &gt;</MenuItem>
          )}
          {onSelectAccount && (
            <MenuItem onClick={() => setSubMenu(AccountTypeEnum.Expense)}>Expense &gt;</MenuItem>
          )}
          {transactionItem && onSelectTransferTransactionItem && (
            <MenuItem onClick={() => setSubMenu('transfer')}>Transfer &gt;</MenuItem>
          )}
          {onLaunchEditor && <MenuItem onClick={onLaunchEditor}>Edit</MenuItem>}
        </MenuList>
      )}
      {(subMenu === AccountTypeEnum.Income || subMenu === AccountTypeEnum.Expense) &&
        onSelectAccount && (
          <CategorizeTransactionMenuAccountList
            accountTypes={[subMenu]}
            onBack={clearSubMenu}
            onAccountSelected={onSelectAccount}
          />
        )}
      {transactionItem && subMenu === 'transfer' && onSelectTransferTransactionItem && (
        <CategorizeTransactionMenuTransferTransactions
          transactionItem={transactionItem}
          onTransactionItemListUpdate={() => popoverActions.current?.updatePosition()}
          onSelect={(_transactionItem) => onSelectTransferTransactionItem(_transactionItem)}
          onBack={clearSubMenu}
        />
      )}
    </Popover>
  );
};
