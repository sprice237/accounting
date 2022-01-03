import { VFC } from 'react';
import { Sidebar as UISidebar } from '@sprice237/accounting-ui';

export const Sidebar: VFC = () => {
  return (
    <UISidebar.Wrapper>
      <UISidebar.Link name="Accounts" to="/accounts" />
      <UISidebar.Link name="Transactions" to="/transactions" />
      <UISidebar.Section>Reports</UISidebar.Section>
      <UISidebar.Link name="Balance sheet" to="/reports/balance-sheet" />
      <UISidebar.Link name="Profit and loss" to="/reports/profit-and-loss" />
    </UISidebar.Wrapper>
  );
};
