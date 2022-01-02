import { useState, VFC } from 'react';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import { AccountsDocument, useCreateAccountMutation } from '@sprice237/accounting-gql';
import { AddAccountFormData, AddAccountTableRow } from './AddAccountTableRow';

export const AccountListFooter: VFC = () => {
  const [isAddRowVisible, setIsAddRowVisible] = useState(false);

  const [createAccount] = useCreateAccountMutation();

  const showAddRow = () => {
    setIsAddRowVisible(true);
  };

  const hideAddRow = () => {
    setIsAddRowVisible(false);
  };

  const onAddAccountTableRowSubmit = async (formData: AddAccountFormData) => {
    await createAccount({
      variables: { input: formData },
      refetchQueries: [AccountsDocument],
    });
    hideAddRow();
  };

  return (
    <TableFooter>
      {isAddRowVisible && (
        <AddAccountTableRow onSubmit={onAddAccountTableRowSubmit} onCancel={hideAddRow} />
      )}
      {!isAddRowVisible && (
        <TableRow>
          <TableCell colSpan={2} />
          <TableCell>
            <Button onClick={showAddRow}>Add</Button>
          </TableCell>
        </TableRow>
      )}
    </TableFooter>
  );
};
