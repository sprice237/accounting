import { VFC } from 'react';
import { useAccountsQuery, AccountTypeEnum } from '@sprice237/accounting-gql';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AccountListFooter } from './AccountListFooter';
import { AccountListRow } from './AccountListRow';

type AccountList = {
  accountType: AccountTypeEnum;
};

export const AccountList: VFC<AccountList> = ({ accountType }) => {
  const { data: { accounts } = {} } = useAccountsQuery({
    variables: {
      input: {
        types: [accountType],
      },
    },
  });

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
          {(accounts ?? []).map((account) => (
            <AccountListRow key={account.id} account={account} />
          ))}
        </TableBody>
        <AccountListFooter accountType={accountType} />
      </Table>
    </Card>
  );
};
