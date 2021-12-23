import { VFC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAccountsQuery } from '@sprice237/accounting-gql';

export type AccountSelectProps = {
  value: string | undefined;
  onChange: (accountId: string | undefined) => void;
  showNone?: boolean;
};

export const AccountSelect: VFC<AccountSelectProps> = ({ value, onChange, showNone = false }) => {
  const { data: { accounts } = {} } = useAccountsQuery();

  return (
    <Select
      onChange={(e) => onChange(e.target.value === '(none)' ? undefined : e.target.value)}
      value={value ?? '(none)'}
    >
      {!value && !showNone && <MenuItem value="(none)">(none)</MenuItem>}
      {showNone && <MenuItem value="(none)">(none)</MenuItem>}
      {(accounts ?? []).map((account) => (
        <MenuItem key={account.id} value={account.id}>
          {account.name}
        </MenuItem>
      ))}
    </Select>
  );
};
