import { VFC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AccountsRoute } from '$routes/AccountsRoute';
import { TransactionsRoute } from '$routes/TransactionsRoute';

export const AppRouter: VFC = () => {
  return (
    <Switch>
      <Route exact path="/">
        App
      </Route>
      <Route exact path="/accounts" component={AccountsRoute} />
      <Route exact path="/transactions" component={TransactionsRoute} />
      <Redirect to="/" />
    </Switch>
  );
};
