import { VFC } from 'react';
import formatDate from 'date-fns/format';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {
  TransactionItemTypeEnum,
  useCreateTransactionItemMutation,
  useUpdateTransactionItemMutation,
  useDeleteTransactionItemMutation,
  TransactionItemFragment,
} from '@sprice237/accounting-gql';

import { AccountSelect } from '$cmp/accounts/AccountSelect';

export type TransactionItemRowProps = {
  transactionItem: TransactionItemFragment;
};

export const TransactionItemRow: VFC<TransactionItemRowProps> = ({ transactionItem }) => {
  const [createTransactionItem] = useCreateTransactionItemMutation();
  const [updateTransactionItem] = useUpdateTransactionItemMutation();
  const [deleteTransactionItem] = useDeleteTransactionItemMutation();

  return (
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
          const otherTransactionItems = transactionItem.transaction.items.filter(
            (_transactionItem) => _transactionItem.id !== transactionItem.id
          );
          if (otherTransactionItems.length > 1) {
            return 'Multiple';
          }

          const otherTransactionItem = otherTransactionItems[0];

          return (
            <AccountSelect
              showNone
              value={otherTransactionItem?.account.id}
              onChange={(accountId) => {
                if (!otherTransactionItem && accountId) {
                  createTransactionItem({
                    variables: {
                      input: {
                        accountId,
                        date: transactionItem.date,
                        amount: transactionItem.amount,
                        type:
                          transactionItem.type === TransactionItemTypeEnum.Credit
                            ? TransactionItemTypeEnum.Debit
                            : TransactionItemTypeEnum.Credit,
                        transactionId: transactionItem.transaction.id,
                      },
                    },
                  });
                } else if (otherTransactionItem && accountId) {
                  updateTransactionItem({
                    variables: {
                      transactionItemId: otherTransactionItem.id,
                      input: {
                        accountId,
                        date: otherTransactionItem.date,
                        amount: otherTransactionItem.amount,
                        type: otherTransactionItem.type,
                      },
                    },
                  });
                } else if (otherTransactionItem && !accountId) {
                  deleteTransactionItem({
                    variables: {
                      transactionItemId: otherTransactionItem.id,
                    },
                  });
                }
              }}
            />
          );
        })()}
      </TableCell>
      <TableCell>{transactionItem.description}</TableCell>
    </TableRow>
  );
};
