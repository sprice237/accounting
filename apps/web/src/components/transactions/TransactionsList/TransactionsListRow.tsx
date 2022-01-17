import { useState, VFC } from 'react';
import formatDate from 'date-fns/format';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TransactionItemFragment } from '@sprice237/accounting-gql';
import { useFlagState } from '@sprice237/accounting-ui';
import { TransactionEditorModal, TransactionEditorModel } from '$cmp/transactions/editor';
import { ReconciledAccountCell } from './ReconciledAccountCell';

type TransactionsListRowProps = {
  transactionItem: TransactionItemFragment;
  isSelected: boolean;
  onSelectionChanged: (selection: boolean) => void;
};

export const TransactionsListRow: VFC<TransactionsListRowProps> = ({
  transactionItem,
  isSelected,
  onSelectionChanged,
}) => {
  const [isEditorModalVisible, showEditorModal, hideEditorModal] = useFlagState();
  const [transactionEditorModalInitialValue, setTransactionEditorModalInitialValue] =
    useState<TransactionEditorModel>();

  const launchEditorModal = () => {
    const transactionEditorModel: TransactionEditorModel = {
      id: transactionItem.transaction?.id ?? null,
      items: transactionItem.transaction?.items.map((item) => ({
        id: item.id,
        accountId: item.account.id,
        creditAmount: item.amount.gte(0) ? item.amount.toFixed(2) : '',
        debitAmount: item.amount.lt(0) ? item.amount.mul(-1).toFixed(2) : '',
        date: item.date,
        description: item.description ?? '',
      })) ?? [
        {
          id: transactionItem.id,
          accountId: transactionItem.account.id,
          creditAmount: transactionItem.amount.gte(0) ? transactionItem.amount.toFixed(2) : '',
          debitAmount: transactionItem.amount.lt(0)
            ? transactionItem.amount.mul(-1).toFixed(2)
            : '',
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
        <TableCell>
          <Checkbox checked={isSelected} onChange={(e) => onSelectionChanged(e.target.checked)} />
        </TableCell>
        <TableCell>{formatDate(transactionItem.date, 'MM/dd/yyyy')}</TableCell>
        <TableCell>{transactionItem.description}</TableCell>
        <TableCell>{transactionItem.account.name}</TableCell>
        <ReconciledAccountCell
          onLaunchEditor={launchEditorModal}
          transactionItem={transactionItem}
        />
        <TableCell>
          {transactionItem.amount.lt(0) && (
            <span style={{ color: 'green' }}>{transactionItem.amount.mul(-1).toFixed(2)}</span>
          )}
          {transactionItem.amount.eq(0) && (
            <span style={{ color: 'black' }}>{transactionItem.amount.toFixed(2)}</span>
          )}
          {transactionItem.amount.gt(0) && (
            <span style={{ color: 'red' }}>{transactionItem.amount.toFixed(2)}</span>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
