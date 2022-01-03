import { VFC } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Button, TextField } from '@sprice237/accounting-ui';
import { AccountSelect } from '$cmp/accounts/AccountSelect';
import { TransactionItem } from './types';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

type TransactionEditorItemRowProps = {
  value: TransactionItem;
  onChange: (newValue: TransactionItem) => void;
  onRemove: () => void;
};

export const TransactionEditorItemRow: VFC<TransactionEditorItemRowProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const setAccount = (accountId: string) => {
    onChange({
      ...value,
      accountId,
    });
  };

  const setDate = (date: Date | null) => {
    onChange({
      ...value,
      date: date ?? value.date,
    });
  };

  const setCreditAmount = (creditAmount: string) => {
    onChange({
      ...value,
      creditAmount: value.debitAmount === '' ? creditAmount : value.creditAmount,
    });
  };

  const formatCreditAmount = () => {
    onChange({
      ...value,
      creditAmount:
        value.debitAmount === '' && value.creditAmount != ''
          ? parseFloat(value.creditAmount).toFixed(2)
          : '',
    });
  };

  const setDebitAmount = (debitAmount: string) => {
    onChange({
      ...value,
      debitAmount: value.creditAmount === '' ? debitAmount : value.debitAmount,
    });
  };

  const formatDebitAmount = () => {
    onChange({
      ...value,
      debitAmount:
        value.creditAmount === '' && value.debitAmount != ''
          ? parseFloat(value.debitAmount).toFixed(2)
          : '',
    });
  };

  const setDescription = (description: string) => {
    onChange({
      ...value,
      description,
    });
  };

  return (
    <TableRow key={value.id ?? value.newItemIndex}>
      <TableCell>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <AccountSelect value={value.accountId} onChange={(accountId) => setAccount(accountId!)} />
      </TableCell>
      <TableCell>
        <DesktopDatePicker
          inputFormat="MM/dd/yyyy"
          value={value.date}
          onChange={setDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          value={value.creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
          onBlur={formatCreditAmount}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          value={value.debitAmount}
          onChange={(e) => setDebitAmount(e.target.value)}
          onBlur={formatDebitAmount}
        />
      </TableCell>
      <TableCell>
        <TextField value={value.description} onChange={(e) => setDescription(e.target.value)} />
      </TableCell>
      <TableCell>
        <Button onClick={onRemove}>Remove</Button>
      </TableCell>
    </TableRow>
  );
};
