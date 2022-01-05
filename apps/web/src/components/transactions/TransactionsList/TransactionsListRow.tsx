import { useState, VFC } from 'react';
import formatDate from 'date-fns/format';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TransactionItemFragment } from '@sprice237/accounting-gql';
import { Button, useFlagState } from '@sprice237/accounting-ui';
import { TransactionEditorModal, TransactionEditorModel } from '$cmp/transactions/editor';

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

type TransactionsListRowProps = {
  transactionItem: TransactionItemFragment;
};

export const TransactionsListRow: VFC<TransactionsListRowProps> = ({ transactionItem }) => {
  const [isEditorModalVisible, showEditorModal, hideEditorModal] = useFlagState();
  const [transactionEditorModalInitialValue, setTransactionEditorModalInitialValue] =
    useState<TransactionEditorModel>();

  const launchEditorModal = () => {
    const transactionEditorModel: TransactionEditorModel = {
      id: transactionItem.transaction?.id ?? null,
      items: transactionItem.transaction?.items.map((item) => ({
        id: item.id,
        accountId: item.account.id,
        creditAmount: item.type === 'CREDIT' ? item.amount.toFixed(2) : '',
        debitAmount: item.type === 'DEBIT' ? item.amount.toFixed(2) : '',
        date: item.date,
        description: item.description ?? '',
      })) ?? [
        {
          id: transactionItem.id,
          accountId: transactionItem.account.id,
          creditAmount: transactionItem.type === 'CREDIT' ? transactionItem.amount.toFixed(2) : '',
          debitAmount: transactionItem.type === 'DEBIT' ? transactionItem.amount.toFixed(2) : '',
          date: transactionItem.date,
          description: transactionItem.description ?? '',
        },
      ],
    };

    setTransactionEditorModalInitialValue(transactionEditorModel);
    showEditorModal();
  };

  const closeEditorModal = () => {
    hideEditorModal();
    setTransactionEditorModalInitialValue(undefined);
  };

  return (
    <>
      {isEditorModalVisible && transactionEditorModalInitialValue && (
        <TransactionEditorModal
          initialValue={transactionEditorModalInitialValue}
          onClose={closeEditorModal}
        />
      )}
      <TableRow>
        <TableCell>{formatDate(transactionItem.date, 'MM/dd/yyyy')}</TableCell>
        <TableCell>{transactionItem.description}</TableCell>
        <TableCell>{transactionItem.account.name}</TableCell>
        <TableCell>{getReconciledAccountName(transactionItem)}</TableCell>
        <TableCell>
          {transactionItem.amount.mul(transactionItem.type === 'CREDIT' ? -1 : 1).toFixed(2)}
        </TableCell>
        <TableCell>
          <Button onClick={launchEditorModal}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
};
