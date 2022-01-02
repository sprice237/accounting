import { VFC } from 'react';
import { useTransactionItemsForAccountQuery } from '@sprice237/accounting-gql';

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

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {(transactionItems ?? []).map((transactionItem) => (
          <tr key={transactionItem.id}>
            <td>{transactionItem.transaction.date.toISOString()}</td>
            <td>{transactionItem.type}</td>
            <td>{transactionItem.amount.toString()}</td>
            <td>{transactionItem.transaction.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
