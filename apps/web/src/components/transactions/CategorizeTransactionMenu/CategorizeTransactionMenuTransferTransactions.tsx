import { useEffect, VFC } from 'react';
import formatDate from 'date-fns/format';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { TransactionItemFragment, useTransactionItemsQuery } from '@sprice237/accounting-gql';

type CategorizeTransactionMenuTransferTransactionsProps = {
  transactionItem: TransactionItemFragment;
  onTransactionItemListUpdate?: () => void;
  onSelect: (transactionItem: TransactionItemFragment) => void;
  onBack: () => void;
};

export const CategorizeTransactionMenuTransferTransactions: VFC<CategorizeTransactionMenuTransferTransactionsProps> =
  ({ transactionItem, onTransactionItemListUpdate, onSelect, onBack }) => {
    const { data: { transactionItems: result } = { transactionItems: undefined } } =
      useTransactionItemsQuery({
        variables: {
          input: {
            pageSize: 10,
            matchTransactionItemId: transactionItem.id,
            hasTransaction: false,
          },
        },
      });

    const { transactionItems } = result ?? { transactionItems: [] };

    useEffect(() => onTransactionItemListUpdate?.call(null), [transactionItems]);

    return (
      <MenuList>
        <MenuItem onClick={onBack}>&lt; Back</MenuItem>

        {transactionItems.map((_transactionItem) => (
          <MenuItem key={_transactionItem.id} onClick={() => onSelect(_transactionItem)}>
            {_transactionItem.account.name} - {formatDate(_transactionItem.date, 'MM/dd/yyyy')} -{' '}
            {_transactionItem.description}
          </MenuItem>
        ))}
      </MenuList>
    );
  };
