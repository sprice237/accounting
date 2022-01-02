import { VFC } from 'react';
import { useAccountsQuery } from '@sprice237/accounting-gql';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AccountListFooter } from './AccountListFooter';
import { AccountListRow } from './AccountListRow';

export const AccountList: VFC = () => {
  const { data: { accounts } = {} } = useAccountsQuery();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {(accounts ?? []).map((account) => (
          <AccountListRow key={account.id} account={account} />
        ))}
      </TableBody>
      <AccountListFooter />
    </Table>
  );
};
