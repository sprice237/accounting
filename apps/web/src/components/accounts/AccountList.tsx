import { VFC } from 'react';
import { AccountTypeEnum } from '@sprice237/accounting-gql';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AccountListFooter } from './AccountListFooter';
import { AccountListRows } from './AccountListRows';

type AccountListProps = {
  accountType: AccountTypeEnum;
};

export const AccountList: VFC<AccountListProps> = ({ accountType }) => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <AccountListRows accountType={accountType} parentAccountId={null} />
        </TableBody>
        <AccountListFooter accountType={accountType} />
      </Table>
    </Card>
  );
};
