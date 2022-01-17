import { VFC } from 'react';
import Stack from '@mui/material/Stack';
import { CollapsibleCard as _CollapsibleCard } from '@sprice237/accounting-ui';
import { TransactionsList } from '$cmp/transactions/TransactionsList';
import { TransactionsListContextProvider } from '$cmp/transactions/TransactionsList';
import { TransactionsListSearchParams } from '$cmp/transactions/TransactionsList';
import styled from 'styled-components';

const CollapsibleCard = styled(_CollapsibleCard)`
  margin: 15px;
`;

export const TransactionsListRoute: VFC = () => {
  return (
    <TransactionsListContextProvider>
      <Stack style={{ width: '100%' }}>
        <CollapsibleCard title="Search">
          <TransactionsListSearchParams />
        </CollapsibleCard>
        <CollapsibleCard title="Transactions" initialOpen>
          <TransactionsList />
        </CollapsibleCard>
      </Stack>
    </TransactionsListContextProvider>
  );
};
