import { VFC } from 'react';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { TextField } from '@sprice237/accounting-ui';
import { AccountMultiSelect } from '$cmp/accounts/AccountMultiSelect';
import {
  TransactionsListContextSearchParams,
  useTransactionsListContext,
} from './transactionsListContext';
import { AccountTypeEnum } from '@sprice237/accounting-gql';

export const TransactionsListSearchParams: VFC = () => {
  const { searchParams, setSearchParams } = useTransactionsListContext();

  const getSearchParamsValueSetter =
    <TKey extends keyof TransactionsListContextSearchParams>(key: TKey) =>
    (value: TransactionsListContextSearchParams[TKey]) => {
      setSearchParams((oldSearchParams) => ({
        ...oldSearchParams,
        [key]: value,
      }));
    };

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Beginning date</TableCell>
          <TableCell>
            <DesktopDatePicker
              label="Beginning date"
              inputFormat="MM/dd/yyyy"
              value={searchParams.startDate ?? null}
              onChange={(startDate) => {
                getSearchParamsValueSetter('startDate')(startDate ?? undefined);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>End date</TableCell>
          <TableCell>
            <DesktopDatePicker
              label="End date"
              inputFormat="MM/dd/yyyy"
              value={searchParams.endDate ?? null}
              onChange={(endDate) => {
                getSearchParamsValueSetter('endDate')(endDate ?? undefined);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Source</TableCell>
          <TableCell>
            <AccountMultiSelect
              value={searchParams.sourceAccountIds ?? []}
              onChange={getSearchParamsValueSetter('sourceAccountIds')}
              accountTypes={[AccountTypeEnum.Asset, AccountTypeEnum.Liability]}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Category</TableCell>
          <TableCell>
            <AccountMultiSelect
              value={searchParams.categoryAccountIds ?? []}
              onChange={getSearchParamsValueSetter('categoryAccountIds')}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>
            <Select
              onChange={(e) =>
                getSearchParamsValueSetter('hasTransaction')(JSON.parse(e.target.value) ?? null)
              }
              value={JSON.stringify(searchParams.hasTransaction ?? null)}
            >
              <MenuItem value={'null'}>Any</MenuItem>
              <MenuItem value={'true'}>Categorized</MenuItem>
              <MenuItem value={'false'}>Uncategorized</MenuItem>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Search</TableCell>
          <TableCell>
            <TextField onBlur={(e) => getSearchParamsValueSetter('searchText')(e.target.value)} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
