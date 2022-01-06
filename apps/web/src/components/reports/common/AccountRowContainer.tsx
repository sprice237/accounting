import { VFC } from 'react';
import { AccountTypeEnum } from '@sprice237/accounting-gql';
import { AccountRows } from './AccountRows';
import Big from 'big.js';
import { useFlagState, useToggleState } from '@sprice237/accounting-ui';
import { AccountRow } from './AccountRow';

export type AccountItem = {
  accountId: string;
  parentAccountId: string | null;
  accountName: string;
  accountType: AccountTypeEnum;
  balance: Big;
  descendantsBalance: Big;
};

type AccountRowContainerProps = {
  allAccountItems: AccountItem[];
  accountItem: AccountItem;
  indentLevel: number;
  callout?: boolean;
};

export const AccountRowContainer: VFC<AccountRowContainerProps> = ({
  allAccountItems,
  accountItem,
  indentLevel,
  callout = false,
}) => {
  const { accountId, accountName, accountType, balance, descendantsBalance } = accountItem;
  const hasChildren = !!allAccountItems.filter((_account) => _account.parentAccountId === accountId)
    .length;
  const [isExpanded, toggleIsExpanded] = useToggleState(hasChildren);
  const [isHover, setIsHover, clearIsHover] = useFlagState();

  const adjustedBalance = balance.mul(
    accountType === 'ASSET' || accountType === 'EXPENSE' ? -1 : 1
  );

  const adjustedDescendantsBalance = descendantsBalance.mul(
    accountType === 'ASSET' || accountType === 'EXPENSE' ? -1 : 1
  );

  const mouseEvents = {
    onMouseEnter: setIsHover,
    onMouseLeave: clearIsHover,
    onClick: hasChildren ? toggleIsExpanded : undefined,
  };

  return (
    <>
      <AccountRow
        label={accountName}
        balance={adjustedDescendantsBalance}
        indentLevel={indentLevel}
        callout={callout}
        {...mouseEvents}
      />
      {isExpanded && (
        <>
          {!adjustedBalance.eq(0) && (
            <AccountRow
              label="Uncategorized"
              balance={adjustedBalance}
              indentLevel={indentLevel + 1}
              callout={isHover}
            />
          )}
          <AccountRows
            allAccountItems={allAccountItems}
            rootAccountId={accountId}
            indentLevel={indentLevel + 1}
            callout={isHover}
          />
        </>
      )}
    </>
  );
};
