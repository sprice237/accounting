import { VFC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import { useBalanceSheetReportContext } from './balanceSheetReportContext';
import { AccountRows } from '$cmp/reports/common/AccountRows';

export const BalanceSheetReportContent: VFC = () => {
  const { report } = useBalanceSheetReportContext();

  const {
    assets: { totalBalance: totalAssets, accounts: assetsAccounts },
    liabilities: { totalBalance: totalLiabilities, accounts: liabilityAccounts },
    equity: {
      totalBalance: totalEquity,
      accounts: equityAccounts,
      netProfit,
      unbalancedTransactionsTotal,
    },
  } = report;

  const assetAccountItems = assetsAccounts.map(({ account, balance, descendantsBalance }) => ({
    accountId: account.id,
    parentAccountId: account.parent?.id ?? null,
    accountName: account.name,
    accountType: account.type,
    balance,
    descendantsBalance,
  }));

  const liabilityAccountItems = liabilityAccounts.map(
    ({ account, balance, descendantsBalance }) => ({
      accountId: account.id,
      parentAccountId: account.parent?.id ?? null,
      accountName: account.name,
      accountType: account.type,
      balance,
      descendantsBalance,
    })
  );

  const equityAccountItems = equityAccounts.map(({ account, balance, descendantsBalance }) => ({
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
        <CardHeader title="Assets" />
        <CardContent>
          <Table>
            <TableBody>
              <AccountRows allAccountItems={assetAccountItems} />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{totalAssets.mul(-1).toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Liabilities" />
        <CardContent>
          <Table>
            <TableBody>
              <AccountRows allAccountItems={liabilityAccountItems} />
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{totalLiabilities.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Equity" />
        <CardContent>
          <Table>
            <TableBody>
              <AccountRows allAccountItems={equityAccountItems} />
              <TableRow>
                <TableCell>Net profit</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{netProfit.toFixed(2)}</div>
                </TableCell>
              </TableRow>
              {!unbalancedTransactionsTotal.eq(0) && (
                <TableRow>
                  <TableCell>Unbalanced transactions</TableCell>
                  <TableCell>
                    <div style={{ textAlign: 'right' }}>
                      {unbalancedTransactionsTotal.toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>
                  <div style={{ textAlign: 'right' }}>{totalEquity.toFixed(2)}</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
