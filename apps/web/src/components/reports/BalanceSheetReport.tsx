import { VFC, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useBalanceSheetReportQuery } from '@sprice237/accounting-gql';
import { TextField } from '@sprice237/accounting-ui';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';

export const BalanceSheetReport: VFC = () => {
  const [reportDate, setReportDate] = useState<Date>(() => new Date('2022-01-01T05:00:00Z'));

  const { data: { balanceSheetReport } = {} } = useBalanceSheetReportQuery({
    variables: {
      input: {
        reportDate,
      },
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card>
        <DesktopDatePicker
          label="Report date"
          inputFormat="MM/dd/yyyy"
          value={reportDate}
          onChange={(date) => setReportDate(date ?? new Date())}
          renderInput={(params) => <TextField {...params} />}
        />
      </Card>
      {balanceSheetReport && (
        <>
          <Card>
            <CardHeader title="Assets" />
            <CardContent>
              <Table>
                <TableBody>
                  {balanceSheetReport.assets.accounts.map((accountItem) => (
                    <TableRow key={accountItem.account.id}>
                      <TableCell>{accountItem.account.name}</TableCell>
                      <TableCell>{accountItem.balance.mul(-1).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>
                      {balanceSheetReport.assets.totalBalance.mul(-1).toFixed(2)}
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
                  {balanceSheetReport.liabilities.accounts.map((accountItem) => (
                    <TableRow key={accountItem.account.id}>
                      <TableCell>{accountItem.account.name}</TableCell>
                      <TableCell>{accountItem.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{balanceSheetReport.liabilities.totalBalance.toFixed(2)}</TableCell>
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
                  {balanceSheetReport.equity.accounts.map((accountItem) => (
                    <TableRow key={accountItem.account.id}>
                      <TableCell>{accountItem.account.name}</TableCell>
                      <TableCell>{accountItem.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Net profit</TableCell>
                    <TableCell>{balanceSheetReport.equity.netProfit.toFixed(2)}</TableCell>
                  </TableRow>
                  {!balanceSheetReport.equity.unbalancedTransactionsTotal.eq(0) && (
                    <TableRow>
                      <TableCell>Unbalanced transactions</TableCell>
                      <TableCell>
                        {balanceSheetReport.equity.unbalancedTransactionsTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{balanceSheetReport.equity.totalBalance.toFixed(2)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
