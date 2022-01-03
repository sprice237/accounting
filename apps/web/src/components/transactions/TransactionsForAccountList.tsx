import { VFC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTransactionItemsReportForAccountQuery } from '@sprice237/accounting-gql';

import { TransactionItemRow } from './TransactionItemRow';

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

  if (!transactionItemsReport) {
    return null;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Debit</TableCell>
          <TableCell>Credit</TableCell>
          <TableCell>Balance</TableCell>
          <TableCell>Account</TableCell>
          <TableCell>Description</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Starting balance</TableCell>
          <TableCell>{transactionItemsReport.priorSumDebits.toFixed(2)}</TableCell>
          <TableCell>{transactionItemsReport.priorSumCredits.toFixed(2)}</TableCell>
          <TableCell>
            {transactionItemsReport.priorSumCredits
              .sub(transactionItemsReport.priorSumDebits)
              .toFixed(2)}
          </TableCell>
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
        {transactionItemsReport.items.map((transactionItem) => (
          <TransactionItemRow key={transactionItem.id} transactionItem={transactionItem} />
        ))}
        <TableRow>
          <TableCell>Ending balance</TableCell>
          <TableCell>
            {transactionItemsReport.priorSumDebits.add(transactionItemsReport.sumDebits).toFixed(2)}
          </TableCell>
          <TableCell>
            {transactionItemsReport.priorSumCredits
              .add(transactionItemsReport.sumCredits)
              .toFixed(2)}
          </TableCell>
          <TableCell>
            {transactionItemsReport.priorSumCredits
              .add(transactionItemsReport.sumCredits)
              .sub(transactionItemsReport.priorSumDebits)
              .sub(transactionItemsReport.sumDebits)
              .toFixed(2)}
          </TableCell>
          <TableCell />
          <TableCell />
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
};
