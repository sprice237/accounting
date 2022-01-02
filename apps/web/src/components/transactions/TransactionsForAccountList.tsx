import { VFC } from 'react';
import formatDate from 'date-fns/format';
import {
  TransactionItemTypeEnum,
  useTransactionItemsReportForAccountQuery,
  useCreateTransactionItemMutation,
  useUpdateTransactionItemMutation,
  useDeleteTransactionItemMutation,
} from '@sprice237/accounting-gql';
import { AccountSelect } from '$cmp/accounts/AccountSelect';

export type TransactionsForAccountListProps = {
  accountId: string;
  startDate?: Date;
  endDate?: Date;
};

export const TransactionsForAccountList: VFC<TransactionsForAccountListProps> = ({
  accountId,
  startDate,
  endDate,
}) => {
  const { data: { transactionItemsReportForAccount: transactionItemsReport } = {} } =
    useTransactionItemsReportForAccountQuery({
      variables: {
        input: {
          accountId,
          startDate,
          endDate,
        },
      },
    });

  const [createTransactionItem] = useCreateTransactionItemMutation();
  const [updateTransactionItem] = useUpdateTransactionItemMutation();
  const [deleteTransactionItem] = useDeleteTransactionItemMutation();

  if (!transactionItemsReport) {
    return null;
  }

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
        <tr>
          <td>Starting balance</td>
          <td>{transactionItemsReport.priorSumDebits.toFixed(2)}</td>
          <td>{transactionItemsReport.priorSumCredits.toFixed(2)}</td>
          <td />
          <td />
        </tr>
        {transactionItemsReport.items.map((transactionItem) => (
          <tr key={transactionItem.id}>
            <td>{formatDate(transactionItem.date, 'MM/dd/yyyy')}</td>
            <td>
              {transactionItem.type === TransactionItemTypeEnum.Debit &&
                transactionItem.amount.toFixed(2)}
            </td>
            <td>
              {transactionItem.type === TransactionItemTypeEnum.Credit &&
                transactionItem.amount.toFixed(2)}
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
        <tr>
          <td>Ending balance</td>
          <td>
            {transactionItemsReport.priorSumDebits.add(transactionItemsReport.sumDebits).toFixed(2)}
          </td>
          <td>
            {transactionItemsReport.priorSumCredits
              .add(transactionItemsReport.sumCredits)
              .toFixed(2)}
          </td>
          <td />
          <td />
        </tr>
      </tbody>
    </table>
  );
};
