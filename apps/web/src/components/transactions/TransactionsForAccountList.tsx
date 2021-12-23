import { VFC } from 'react';
import {
  TransactionItemTypeEnum,
  useTransactionItemsForAccountQuery,
  useCreateTransactionItemMutation,
  useUpdateTransactionItemMutation,
  useDeleteTransactionItemMutation,
} from '@sprice237/accounting-gql';
import { AccountSelect } from '$cmp/accounts/AccountSelect';

export type TransactionsForAccountListProps = {
  accountId: string;
};

export const TransactionsForAccountList: VFC<TransactionsForAccountListProps> = ({ accountId }) => {
  const { data: { transactionItemsForAccount: transactionItems } = {} } =
    useTransactionItemsForAccountQuery({
      variables: {
        accountId,
      },
    });

  const [createTransactionItem] = useCreateTransactionItemMutation();
  const [updateTransactionItem] = useUpdateTransactionItemMutation();
  const [deleteTransactionItem] = useDeleteTransactionItemMutation();

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Account</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {(transactionItems ?? []).map((transactionItem) => (
          <tr key={transactionItem.id}>
            <td>{transactionItem.date.toISOString()}</td>
            <td>
              {transactionItem.type === TransactionItemTypeEnum.Debit &&
                transactionItem.amount.toString()}
            </td>
            <td>
              {transactionItem.type === TransactionItemTypeEnum.Credit &&
                transactionItem.amount.toString()}
            </td>
            <td>
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
            </td>
            <td>{transactionItem.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
