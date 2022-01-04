import { useState, VFC } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { AccountSelect } from '$cmp/accounts/AccountSelect';
import { LedgerReportDataTable } from './LedgerReportDataTable';

export const LedgerReport: VFC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <Card>
      <AccountSelect value={selectedAccountId} onChange={setSelectedAccountId} />
      <DesktopDatePicker
        label="Start date"
        inputFormat="MM/dd/yyyy"
        value={startDate}
        onChange={setStartDate}
        renderInput={(params) => <TextField {...params} />}
      />
      <DesktopDatePicker
        label="End date"
        inputFormat="MM/dd/yyyy"
        value={endDate}
        onChange={setEndDate}
        renderInput={(params) => <TextField {...params} />}
      />
      {selectedAccountId && (
        <LedgerReportDataTable
          accountId={selectedAccountId}
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
        />
      )}
    </Card>
  );
};
