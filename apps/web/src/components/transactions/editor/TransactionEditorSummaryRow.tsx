import Big from 'big.js';
import { VFC } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TransactionEditorModel } from './types';
import { Button } from '@sprice237/accounting-ui';

type TransactionEditorSummaryRowProps = {
  value: TransactionEditorModel;
  onAddItem: () => void;
};

export const TransactionEditorSummaryRow: VFC<TransactionEditorSummaryRowProps> = ({
  value,
  onAddItem,
}) => {
  const sumCredits = value.items
    .map((item) => (item.creditAmount === '' ? '0' : item.creditAmount))
    .reduce((_sum, _value) => {
      try {
        return _sum?.add(_value);
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }, Big(0) as Big | undefined);
  const sumDebits = value.items
    .map((item) => (item.debitAmount === '' ? '0' : item.debitAmount))
    .reduce((_sum, _value) => {
      try {
        return _sum?.add(_value);
      } catch (e) {
        console.error(e);
        return undefined;
      }
    }, Big(0) as Big | undefined);

  return (
    <TableRow>
      <TableCell>
        <Button onClick={onAddItem}>Add</Button>
      </TableCell>
      <TableCell />
      <TableCell>{sumCredits?.toFixed(2)}</TableCell>
      <TableCell>{sumDebits?.toFixed(2)}</TableCell>
      <TableCell />
      <TableCell />
    </TableRow>
  );
};
