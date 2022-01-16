import { VFC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { TransactionsList } from '$cmp/transactions/TransactionsList';
import { TransactionsListContextProvider } from '$cmp/transactions/TransactionsList';
import { TransactionsListSearchParams } from '$cmp/transactions/TransactionsList';

export const TransactionsListRoute: VFC = () => {
  return (
    <TransactionsListContextProvider>
      <Stack style={{ width: '100%' }}>
        <Card style={{ margin: '15px' }}>
          <CardHeader title="Search" />
          <CardContent>
            <TransactionsListSearchParams />
          </CardContent>
        </Card>
        <Card style={{ margin: '15px' }}>
          <CardContent>
            <TransactionsList />
          </CardContent>
        </Card>
      </Stack>
    </TransactionsListContextProvider>
  );
};
