import { useState, VFC } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import {
  AccountsDocument,
  AccountTypeEnum,
  useCreateAccountMutation,
} from '@sprice237/accounting-gql';
import { AddAccountFormData, AddAccountTableRow } from './AddAccountTableRow';

type AccountListFooter = {
  accountType: AccountTypeEnum;
};

export const AccountListFooter: VFC<AccountListFooter> = ({ accountType }) => {
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
      variables: {
        input: {
          ...formData,
          type: accountType,
        },
      },
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
          <TableCell colSpan={3}>
            <Grid container justifyContent="center">
              <Button onClick={showAddRow}>Add</Button>
            </Grid>
          </TableCell>
        </TableRow>
      )}
    </TableFooter>
  );
};
