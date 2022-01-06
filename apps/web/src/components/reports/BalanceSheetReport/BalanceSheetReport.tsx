import { VFC, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField } from '@sprice237/accounting-ui';
import { BalanceSheetReportContextProvider } from './balanceSheetReportContext';
import { BalanceSheetReportContent } from './BalanceSheetReportContent';

export const BalanceSheetReport: VFC = () => {
  const [reportDate, setReportDate] = useState<Date>(() => new Date('2022-01-01T05:00:00Z'));

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
      <BalanceSheetReportContextProvider reportDate={reportDate}>
        <BalanceSheetReportContent />
      </BalanceSheetReportContextProvider>
    </Box>
  );
};
