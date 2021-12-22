import { VFC } from 'react';
import { useAccountsQuery } from '@sprice237/accounting-gql';

export const AccountList: VFC = () => {
  const { data: { accounts } = {} } = useAccountsQuery();

  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {(accounts ?? []).map((account) => (
          <tr key={account.id}>
            <td>{account.id}</td>
            <td>{account.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
