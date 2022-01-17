import { VFC } from 'react';
import Checkbox from '@mui/material/Checkbox';
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
  const { transactionItems, selectedTransactionItems, setSelectedTransactionItems, loadNextPage } =
    useTransactionsListContext();

  const isSelectAllCheckboxChecked = transactionItems?.length === selectedTransactionItems.length;

  const handleSelectAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedTransactionItems([...(transactionItems ?? [])]);
    } else {
      setSelectedTransactionItems([]);
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox
              checked={isSelectAllCheckboxChecked}
              onChange={(e) => handleSelectAllCheckboxChange(e.target.checked)}
            />
          </TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Account</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(transactionItems ?? []).map((transactionItem) => (
          <TransactionsListRow
            key={transactionItem.id}
            transactionItem={transactionItem}
            isSelected={selectedTransactionItems.includes(transactionItem)}
            onSelectionChanged={(selected) => {
              setSelectedTransactionItems((oldSelectedTransactionItems) => [
                ...oldSelectedTransactionItems.filter(({ id }) => id !== transactionItem.id),
                ...(selected ? [transactionItem] : []),
              ]);
            }}
          />
        ))}
      </TableBody>
      {loadNextPage && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
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
