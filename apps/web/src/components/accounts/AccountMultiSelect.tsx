import { useMemo, VFC } from 'react';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AccountTypeEnum, useAccountsQuery } from '@sprice237/accounting-gql';

export type AccountMultiSelectProps = {
  value: string[];
  onChange: (accountIds: string[]) => void;
  accountTypes?: AccountTypeEnum[];
};

export const AccountMultiSelect: VFC<AccountMultiSelectProps> = ({
  value,
  onChange,
  accountTypes,
}) => {
  const { data: { accounts } = {} } = useAccountsQuery({
    variables: {
      input: {
        types: accountTypes,
      },
    },
  });

  const accountsById = useMemo(
    () => new Map((accounts ?? []).map((account) => [account.id, account])),
    [accounts]
  );

  return (
    <Select
      multiple
      onChange={(e) => onChange(e.target.value as string[])}
      value={value}
      renderValue={(selectedAccountIds) =>
        selectedAccountIds.map((accountId) => accountsById.get(accountId)?.name ?? '').join(', ')
      }
    >
      {(accounts ?? []).map((account) => (
        <MenuItem key={account.id} value={account.id}>
          <Checkbox checked={value.indexOf(account.id) > -1} />
          <ListItemText primary={account.name} />
        </MenuItem>
      ))}
    </Select>
  );
};
