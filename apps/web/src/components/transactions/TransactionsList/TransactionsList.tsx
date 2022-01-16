import { VFC } from 'react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import { Button } from '@sprice237/accounting-ui';
import { TransactionsListRow } from './TransactionsListRow';
import { useTransactionsListContext } from './transactionsListContext';

export const TransactionsList: VFC = () => {
  const { transactionItems, loadNextPage } = useTransactionsListContext();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Account</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(transactionItems ?? []).map((transactionItem) => (
          <TransactionsListRow key={transactionItem.id} transactionItem={transactionItem} />
        ))}
      </TableBody>
      {loadNextPage && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <Grid container justifyContent="center">
                <Button onClick={loadNextPage}>More</Button>
              </Grid>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};
