import { VFC } from 'react';
import { AccountFragment } from '@sprice237/accounting-gql';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

type AccountListRowProps = {
  account: AccountFragment;
};

export const AccountListRow: VFC<AccountListRowProps> = ({ account }) => {
  return (
    <TableRow>
      <TableCell>{account.name}</TableCell>
      <TableCell />
    </TableRow>
  );
};
