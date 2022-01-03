import { FC, Fragment, forwardRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TransactionEditorModel, TransactionItem } from './types';
import { TransactionEditorItemRow } from './TransactionEditorItemRow';
import { Button } from '@sprice237/accounting-ui';
import { TransactionEditorSummaryRow } from './TransactionEditorSummaryRow';

type TransactionEditorProps = {
  initialValue: TransactionEditorModel;
  onSubmit: (value: TransactionEditorModel) => void;
  onCancel: () => void;
  ActionsWrapper?: FC;
};

export const TransactionEditor = forwardRef<HTMLDivElement, TransactionEditorProps>(
  ({ initialValue, onSubmit, onCancel, ActionsWrapper = Fragment }, ref) => {
    const [value, setValue] = useState(initialValue);
    const [nextNewItemIndex, setNextNewItemIndex] = useState(0);

    const addItem = () => {
      setValue((oldValue) => ({
        ...oldValue,
        items: [
          ...oldValue.items,
          {
            id: null,
            newItemIndex: nextNewItemIndex,
            accountId: undefined,
            date: new Date(),
            creditAmount: '',
            debitAmount: '',
            description: '',
          },
        ],
      }));
      setNextNewItemIndex((x) => x + 1);
    };

    const updateItem = (oldItem: TransactionItem, newItem: TransactionItem) => {
      setValue((oldValue) => ({
        ...oldValue,
        items: oldValue.items.map((_item) => (_item === oldItem ? newItem : _item)),
      }));
    };

    const removeItem = (item: TransactionItem) => {
      setValue((oldValue) => ({
        ...oldValue,
        items: oldValue.items.filter((_item) => _item !== item),
      }));
    };

    const submit = () => {
      onSubmit(value);
    };

    return (
      <div ref={ref}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Description</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {value.items.map((item) => (
              <TransactionEditorItemRow
                key={item.id ?? item.newItemIndex}
                value={item}
                onChange={(newItem) => updateItem(item, newItem)}
                onRemove={() => removeItem(item)}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TransactionEditorSummaryRow value={value} onAddItem={addItem} />
          </TableFooter>
        </Table>
        <ActionsWrapper>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={submit}>Submit</Button>
        </ActionsWrapper>
      </div>
    );
  }
);
