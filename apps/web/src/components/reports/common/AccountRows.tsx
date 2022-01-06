import { VFC } from 'react';
import { AccountItem, AccountRowContainer } from './AccountRowContainer';

type AccountRowsProps = {
  allAccountItems: AccountItem[];
  rootAccountId?: string;
  indentLevel?: number;
  callout?: boolean;
};

export const AccountRows: VFC<AccountRowsProps> = ({
  allAccountItems,
  rootAccountId = null,
  indentLevel = 0,
  callout = false,
}) => {
  const accountItems = allAccountItems.filter(
    ({ parentAccountId }) => parentAccountId === rootAccountId
  );

  return (
    <>
      {accountItems.map((accountItem) => (
        <AccountRowContainer
          key={accountItem.accountId}
          allAccountItems={allAccountItems}
          accountItem={accountItem}
          indentLevel={indentLevel}
          callout={callout}
        />
      ))}
    </>
  );
};
