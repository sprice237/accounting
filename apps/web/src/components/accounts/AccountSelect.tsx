import { VFC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAccountsQuery } from '@sprice237/accounting-gql';

export type AccountSelectProps = {
  value: string | undefined;
  onChange: (accountId: string) => void;
};

export const AccountSelect: VFC<AccountSelectProps> = ({ value, onChange }) => {
  const { data: { accounts } = {} } = useAccountsQuery();

  return (
    <Select onChange={(e) => onChange(e.target.value)} value={value}>
      {!value && <option />}
      {(accounts ?? []).map((account) => (
        <MenuItem key={account.id} value={account.id}>
          {account.name}
        </MenuItem>
      ))}
    </Select>
  );
};
