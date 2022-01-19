import { useState, VFC } from 'react';
import TableCell from '@mui/material/TableCell';
import {
  AccountFragment,
  TransactionItemFragment,
  useCategorizeTransactionItemsMutation,
  useLinkTransactionItemsMutation,
  useUncategorizeTransactionItemsMutation,
} from '@sprice237/accounting-gql';
import { CategorizeTransactionMenu } from '$cmp/transactions/CategorizeTransactionMenu';
import { Button, useFlagState } from '@sprice237/accounting-ui';

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
  const [linkTransactionItems] = useLinkTransactionItemsMutation();
  const [uncategorizeTransactionItems] = useUncategorizeTransactionItemsMutation();

  const onUncategorize = async () => {
    await uncategorizeTransactionItems({
      variables: {
        transactionItemIds: [transactionItem.id],
      },
    });
  };

  const onAccountSelected = async (account: AccountFragment | null) => {
    await onUncategorize();
    if (account) {
      await categorizeTransactionItems({
        variables: {
          transactionItemIds: [transactionItem.id],
          accountId: account.id,
        },
      });
    }
    hideMenu();
  };

  const onTransfer = async (transactionItemToLink: TransactionItemFragment) => {
    await onUncategorize();
    await linkTransactionItems({
      variables: {
        transactionItemId: transactionItem.id,
        transactionItemIdToLink: transactionItemToLink.id,
      },
    });
  };

  const launchEditor = () => {
    hideMenu();
    onLaunchEditor();
  };

  return (
    <TableCell style={{ cursor: 'pointer' }}>
      <Button ref={setReferenceElement} onClick={showMenu} variant="outlined">
        {getReconciledAccountName(transactionItem)}
      </Button>
      {isMenuVisible && referenceElement && (
        <CategorizeTransactionMenu
          transactionItem={transactionItem}
          referenceElement={referenceElement}
          onLaunchEditor={launchEditor}
          onSelectAccount={onAccountSelected}
          onSelectTransferTransactionItem={(_transactionItem) => onTransfer(_transactionItem)}
          onUncategorize={onUncategorize}
          onClose={hideMenu}
        />
      )}
    </TableCell>
  );
};
