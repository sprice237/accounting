import { useState, VFC } from 'react';
import TableCell from '@mui/material/TableCell';
import { TransactionItemFragment } from '@sprice237/accounting-gql';
import { CategorizeTransactionMenu } from '$cmp/transactions/CategorizeTransactionMenu';
import { useFlagState } from '@sprice237/accounting-ui';

const getReconciledAccountName = (transactionItem: TransactionItemFragment) => {
  if (!transactionItem.transaction) {
    return 'Unreconciled';
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
          transactionItem={transactionItem}
          onLaunchEditor={launchEditor}
          onClose={hideMenu}
        />
      )}
    </TableCell>
  );
};
