import { useRef, VFC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AccountFragment, useSetAccountParentMutation } from '@sprice237/accounting-gql';
import { useToggleState } from '@sprice237/accounting-ui';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AccountListRows } from './AccountListRows';

type AccountListRowProps = {
  account: AccountFragment;
  indentLevel: number;
};

export const AccountListRow: VFC<AccountListRowProps> = ({ account, indentLevel }) => {
  const [isExpanded, toggleExpanded] = useToggleState(true);
  const [setAccountParent] = useSetAccountParentMutation();

  const [, dragRef] = useDrag(() => ({
    type: 'account',
    item: account,
  }));
  const [, dropRef] = useDrop<AccountFragment, void, unknown>(() => ({
    accept: 'account',
    drop: (droppedItem) => {
      if (droppedItem.id === account.id) {
        return;
      }

      setAccountParent({
        variables: {
          accountId: droppedItem.id,
          parentAccountId: account.id,
        },
      });
    },
  }));

  const { current: combinedRef } = useRef((item: HTMLElement | null) => {
    dragRef(item);
    dropRef(item);
  });

  return (
    <>
      <TableRow ref={combinedRef}>
        <TableCell>
          <div onClick={toggleExpanded} style={{ marginLeft: `${indentLevel * 15}px` }}>
            {account.name}
          </div>
        </TableCell>
        <TableCell />
      </TableRow>
      {isExpanded && (
        <AccountListRows
          accountType={account.type}
          parentAccountId={account.id}
          indentLevel={indentLevel + 1}
        />
      )}
    </>
  );
};
