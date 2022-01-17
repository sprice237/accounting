import { useState, VFC } from 'react';
import TableCell from '@mui/material/TableCell';
import {
  AccountFragment,
  TransactionItemFragment,
  useCategorizeTransactionItemsMutation,
  useUncategorizeTransactionItemsMutation,
} from '@sprice237/accounting-gql';
import { CategorizeTransactionMenu } from '$cmp/transactions/CategorizeTransactionMenu';
import { useFlagState } from '@sprice237/accounting-ui';

const getReconciledAccountName = (transactionItem: TransactionItemFragment) => {
  if (!transactionItem.transaction) {
    return 'Uncategorized';
  }

  const otherTransactionItems = transactionItem.transaction.items.filter(
    (_item) => _item.id !== transactionItem.id
  );

  if (otherTransactionItems.length === 0) {
    return 'Error';
  }
  if (otherTransactionItems.length === 1) {
    return otherTransactionItems[0]?.account.name;
  }

  return 'Multiple';
};

type ReconciledAccountCellProps = {
  transactionItem: TransactionItemFragment;
  onLaunchEditor: () => void;
};

export const ReconciledAccountCell: VFC<ReconciledAccountCellProps> = ({
  transactionItem,
  onLaunchEditor,
}) => {
  const [isMenuVisible, showMenu, hideMenu] = useFlagState();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  const [categorizeTransactionItems] = useCategorizeTransactionItemsMutation();
  const [uncategorizeTransactionItems] = useUncategorizeTransactionItemsMutation();

  const onAccountSelected = async (account: AccountFragment | null) => {
    if (account) {
      await categorizeTransactionItems({
        variables: {
          transactionItemIds: [transactionItem.id],
          accountId: account.id,
        },
      });
    } else {
      await uncategorizeTransactionItems({
        variables: {
          transactionItemIds: [transactionItem.id],
        },
      });
    }
    hideMenu();
  };

  const launchEditor = () => {
    hideMenu();
    onLaunchEditor();
  };

  return (
    <TableCell style={{ cursor: 'pointer' }}>
      <div ref={setReferenceElement} onClick={showMenu}>
        {getReconciledAccountName(transactionItem)}
      </div>
      {isMenuVisible && referenceElement && (
        <CategorizeTransactionMenu
          referenceElement={referenceElement}
          onLaunchEditor={launchEditor}
          onSelect={onAccountSelected}
          onClose={hideMenu}
        />
      )}
    </TableCell>
  );
};
