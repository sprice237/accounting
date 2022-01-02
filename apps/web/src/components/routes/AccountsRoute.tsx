import { VFC } from 'react';
import Card from '@mui/material/Card';
import { AccountList } from '$cmp/accounts/AccountList';

export const AccountsRoute: VFC = () => {
  return (
    <Card>
      <AccountList />
    </Card>
  );
};
