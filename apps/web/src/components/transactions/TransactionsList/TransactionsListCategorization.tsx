import { useState, VFC } from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { useFlagState } from '@sprice237/accounting-ui';
import { CategorizeTransactionMenu } from '$cmp/transactions/CategorizeTransactionMenu';
import { useTransactionsListContext } from './transactionsListContext';
import {
  AccountFragment,
  useCategorizeTransactionItemsMutation,
  useUncategorizeTransactionItemsMutation,
} from '@sprice237/accounting-gql';

export const TransactionsListCategorization: VFC = () => {
  const { selectedTransactionItems } = useTransactionsListContext();
  const [isMenuVisible, showMenu, hideMenu] = useFlagState();
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  const [categorizeTransactionItems] = useCategorizeTransactionItemsMutation();
  const [uncategorizeTransactionItems] = useUncategorizeTransactionItemsMutation();

  const onAccountSelected = async (account: AccountFragment | null) => {
    const transactionItemIds = selectedTransactionItems.map(({ id }) => id);
    if (account) {
      await categorizeTransactionItems({
        variables: {
          transactionItemIds,
          accountId: account.id,
        },
      });
    } else {
      await uncategorizeTransactionItems({
        variables: {
          transactionItemIds,
        },
      });
    }
    hideMenu();
  };

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Button
              ref={setReferenceElement}
              onClick={showMenu}
              disabled={!selectedTransactionItems.length}
            >
              {!selectedTransactionItems.length && 'None selected'}
              {!!selectedTransactionItems.length && 'Categorize selected'}
            </Button>
            {isMenuVisible && referenceElement && (
              <CategorizeTransactionMenu
                referenceElement={referenceElement}
                onSelect={onAccountSelected}
                onClose={hideMenu}
              />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
