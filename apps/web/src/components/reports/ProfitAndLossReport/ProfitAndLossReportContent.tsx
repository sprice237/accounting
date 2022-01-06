import { VFC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import { AccountRows } from '$cmp/reports/common/AccountRows';
import { useProfitAndLossReportContext } from './profitAndLossReportContext';

export const ProfitAndLossReportContent: VFC = () => {
  const { report } = useProfitAndLossReportContext();

  const {
    income: { totalBalance: totalIncome, accounts: incomeAccounts },
    expenses: { totalBalance: totalExpenses, accounts: expenseAccounts },
    netProfit,
  } = report;

  const incomeAccountItems = incomeAccounts.map(({ account, balance, descendantsBalance }) => ({
    accountId: account.id,
    parentAccountId: account.parent?.id ?? null,
    accountName: account.name,
    accountType: account.type,
    balance,
    descendantsBalance,
  }));

  const expenseAccountItems = expenseAccounts.map(({ account, balance, descendantsBalance }) => ({
    accountId: account.id,
    parentAccountId: account.parent?.id ?? null,
    accountName: account.name,
    accountType: account.type,
    balance,
    descendantsBalance,
  }));

  return (
    <>
      <Card>
        <CardHeader title="Income" />
        <CardContent>
          <Table>
            <TableBody>
              <AccountRows allAccountItems={incomeAccountItems} />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{totalIncome.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Expenses" />
        <CardContent>
          <Table>
            <TableBody>
              <AccountRows allAccountItems={expenseAccountItems} />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{totalExpenses.mul(-1).toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Total" />
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Net profit</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{netProfit.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
