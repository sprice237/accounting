import { useState, VFC } from 'react';
import Card from '@mui/material/Card';
import { AccountSelect } from '$cmp/accounts/AccountSelect';
import { TransactionsForAccountList } from '$cmp/transactions/TransactionsForAccountList';

export const TransactionsRoute: VFC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();

  return (
    <Card>
      <AccountSelect value={selectedAccountId} onChange={setSelectedAccountId} />
      {selectedAccountId && <TransactionsForAccountList accountId={selectedAccountId} />}
    </Card>
  );
};
