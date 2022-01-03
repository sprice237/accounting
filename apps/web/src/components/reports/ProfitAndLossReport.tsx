import { VFC, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useProfitAndLossReportQuery } from '@sprice237/accounting-gql';
import { TextField } from '@sprice237/accounting-ui';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';

export const ProfitAndLossReport: VFC = () => {
  const [startDate, setStartDate] = useState<Date>(() => new Date('2021-01-01T05:00:00Z'));
  const [endDate, setEndDate] = useState<Date>(() => new Date('2022-01-01T05:00:00Z'));

  const { data: { profitAndLossReport } = {} } = useProfitAndLossReportQuery({
    variables: {
      input: {
        reportStartDate: startDate,
        reportEndDate: endDate,
      },
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card>
        <DesktopDatePicker
          label="Start date"
          inputFormat="MM/dd/yyyy"
          value={startDate}
          onChange={(date) => setStartDate(date ?? new Date())}
          renderInput={(params) => <TextField {...params} />}
        />
        <DesktopDatePicker
          label="End date"
          inputFormat="MM/dd/yyyy"
          value={endDate}
          onChange={(date) => setEndDate(date ?? new Date())}
          renderInput={(params) => <TextField {...params} />}
        />
      </Card>
      {profitAndLossReport && (
        <>
          <Card>
            <CardHeader title="Income" />
            <CardContent>
              <Table>
                <TableBody>
                  {profitAndLossReport.income.accounts.map((accountItem) => (
                    <TableRow key={accountItem.account.id}>
                      <TableCell>{accountItem.account.name}</TableCell>
                      <TableCell>{accountItem.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>{profitAndLossReport.income.totalBalance.toFixed(2)}</TableCell>
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
                  {profitAndLossReport.expenses.accounts.map((accountItem) => (
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
                      {profitAndLossReport.expenses.totalBalance.mul(-1).toFixed(2)}
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
                    <TableCell>{profitAndLossReport.netProfit.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
