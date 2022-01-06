import { VFC, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField } from '@sprice237/accounting-ui';
import { ProfitAndLossReportContextProvider } from './profitAndLossReportContext';
import { ProfitAndLossReportContent } from './ProfitAndLossReportContent';

export const ProfitAndLossReport: VFC = () => {
  const [startDate, setStartDate] = useState<Date>(() => new Date('2021-01-01T05:00:00Z'));
  const [endDate, setEndDate] = useState<Date>(() => new Date('2022-01-01T05:00:00Z'));

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
      <ProfitAndLossReportContextProvider startDate={startDate} endDate={endDate}>
        <ProfitAndLossReportContent />
      </ProfitAndLossReportContextProvider>
    </Box>
  );
};
