import { useState, VFC } from 'react';
import formatDate from 'date-fns/format';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {
  TransactionItemTypeEnum,
  TransactionItemFragment,
  useDeleteTransactionItemMutation,
} from '@sprice237/accounting-gql';
import { Button, useFlagState } from '@sprice237/accounting-ui';

import { TransactionEditorModal, TransactionEditorModel } from './editor';

export type TransactionItemRowProps = {
  transactionItem: TransactionItemFragment;
};

export const TransactionItemRow: VFC<TransactionItemRowProps> = ({ transactionItem }) => {
  const [deleteTransactionItem] = useDeleteTransactionItemMutation();

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

  const remove = async () => {
    await deleteTransactionItem({
      variables: {
        transactionItemId: transactionItem.id,
      },
    });
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
        <TableCell>
          {transactionItem.type === TransactionItemTypeEnum.Debit &&
            transactionItem.amount.toFixed(2)}
        </TableCell>
        <TableCell>
          {transactionItem.type === TransactionItemTypeEnum.Credit &&
            transactionItem.amount.toFixed(2)}
        </TableCell>
        <TableCell>
          {(() => {
            const otherTransactionItems =
              transactionItem.transaction?.items.filter(
                (_transactionItem) => _transactionItem.id !== transactionItem.id
              ) ?? [];
            if (otherTransactionItems.length > 1) {
              return 'Multiple';
            }

            const otherTransactionItem = otherTransactionItems[0];

            return otherTransactionItem?.account.name ?? 'Unreconciled';
          })()}
        </TableCell>
        <TableCell>{transactionItem.description}</TableCell>
        <TableCell>
          <Button onClick={launchEditorModal}>Edit</Button>
          <Button onClick={remove}>Remove</Button>
        </TableCell>
      </TableRow>
    </>
  );
};
