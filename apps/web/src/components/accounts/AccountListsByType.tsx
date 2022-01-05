import { useState, VFC } from 'react';
import { AccountTypeEnum } from '@sprice237/accounting-gql';

import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { AccountList } from './AccountList';

export const AccountListsByType: VFC = () => {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeEnum>(
    AccountTypeEnum.Asset
  );

  return (
    <Grid container justifyContent="center">
      <Grid container direction="column" width={600}>
        <Tabs
          value={selectedAccountType}
          onChange={(_, newAccountType) => setSelectedAccountType(newAccountType)}
        >
          <Tab label="Asset" value={AccountTypeEnum.Asset} />
          <Tab label="Liability" value={AccountTypeEnum.Liability} />
          <Tab label="Equity" value={AccountTypeEnum.Equity} />
          <Tab label="Income" value={AccountTypeEnum.Income} />
          <Tab label="Expense" value={AccountTypeEnum.Expense} />
        </Tabs>
        <AccountList accountType={selectedAccountType} />
      </Grid>
    </Grid>
  );
};
