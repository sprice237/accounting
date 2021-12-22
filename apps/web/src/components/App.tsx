import { VFC } from 'react';
import { GqlProvider } from '@sprice237/accounting-gql';
import { AccountList } from './accounts/AccountList';

export const App: VFC = () => {
  return (
    <GqlProvider uri="http://localhost:8080/graphql">
      <AccountList />
    </GqlProvider>
  );
};
