import { VFC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AccountsRoute } from '$routes/AccountsRoute';
import { BalanceSheetReportRoute } from '$routes/reports/BalanceSheetReportRoute';
import { LedgerReportRoute } from '$routes/reports/LedgerReportRoute';
import { ProfitAndLossReportRoute } from '$routes/reports/ProfitAndLossReportRoute';
import { TransactionsListRoute } from './routes/TransactionsListRoute';

export const AppRouter: VFC = () => {
  return (
    <Switch>
      <Route exact path="/">
        App
      </Route>
      <Route exact path="/accounts" component={AccountsRoute} />
      <Route exact path="/reports/balance-sheet" component={BalanceSheetReportRoute} />
      <Route exact path="/reports/ledger" component={LedgerReportRoute} />
      <Route exact path="/reports/profit-and-loss" component={ProfitAndLossReportRoute} />
      <Route exact path="/transactions" component={TransactionsListRoute} />
      <Redirect to="/" />
    </Switch>
  );
};
