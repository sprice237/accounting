import { VFC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AccountsRoute } from '$routes/AccountsRoute';
import { BalanceSheetReportRoute } from '$routes/reports/BalanceSheetReportRoute';
import { ProfitAndLossReportRoute } from '$routes/reports/ProfitAndLossReportRoute';
import { TransactionsRoute } from '$routes/TransactionsRoute';

export const AppRouter: VFC = () => {
  return (
    <Switch>
      <Route exact path="/">
        App
      </Route>
      <Route exact path="/accounts" component={AccountsRoute} />
      <Route exact path="/reports/balance-sheet" component={BalanceSheetReportRoute} />
      <Route exact path="/reports/profit-and-loss" component={ProfitAndLossReportRoute} />
      <Route exact path="/transactions" component={TransactionsRoute} />
      <Redirect to="/" />
    </Switch>
  );
};
