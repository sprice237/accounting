import { VFC } from 'react';
import { Sidebar as UISidebar } from '@sprice237/accounting-ui';

export const Sidebar: VFC = () => {
  return (
    <UISidebar.Wrapper>
      <UISidebar.Link name="Accounts" to="/accounts" />
      <UISidebar.Link name="Transactions" to="/transactions" />
    </UISidebar.Wrapper>
  );
};
