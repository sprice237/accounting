import Big from 'big.js';
import { VFC } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import {
  CreateTransactionInput,
  TransactionItemForTransactionInput,
  UpdateTransactionInput,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '@sprice237/accounting-gql';

import { TransactionEditor } from './TransactionEditor';
import { TransactionEditorModel } from './types';

type TransactionEditorModalProps = {
  initialValue: TransactionEditorModel;
  onClose: () => void;
};

export const TransactionEditorModal: VFC<TransactionEditorModalProps> = ({
  initialValue,
  onClose,
}) => {
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const handleSubmit = async (transactionEditorModel: TransactionEditorModel) => {
    const items: (TransactionItemForTransactionInput | null)[] = transactionEditorModel.items.map(
      (item) =>
        !item.accountId
          ? null
          : {
              id: item.id,
              accountId: item.accountId,
              date: item.date,
              amount: Big(item.creditAmount || 0).sub(Big(item.debitAmount || 0)),
              description: item.description,
            }
    );

    if (items.some((item) => !item)) {
      throw new Error('invalid item');
    }

    const transactionInput: CreateTransactionInput | UpdateTransactionInput = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      items: items.map((item) => item!),
    };

    if (transactionEditorModel.id) {
      await updateTransaction({
        variables: {
          transactionId: transactionEditorModel.id,
          input: transactionInput,
        },
      });
    } else {
      await createTransaction({
        variables: {
          input: transactionInput,
        },
      });
    }

    onClose();
  };

  return (
    <Dialog open fullWidth maxWidth="lg">
      <TransactionEditor
        initialValue={initialValue}
        onSubmit={handleSubmit}
        onCancel={onClose}
        ActionsWrapper={DialogActions}
      />
    </Dialog>
  );
};
