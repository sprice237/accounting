import { useFormik } from 'formik';
import { VFC } from 'react';

import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AccountTypeEnum } from '@sprice237/accounting-gql';
import { TextField } from '@sprice237/accounting-ui';

type AddAccountTableRowProps = {
  onCancel: () => void;
  onSubmit: (formData: AddAccountFormData) => void;
};

export type AddAccountFormData = {
  name: string;
  type: AccountTypeEnum;
};

const initialValues: AddAccountFormData = {
  name: '',
  type: AccountTypeEnum.Asset,
};

export const AddAccountTableRow: VFC<AddAccountTableRowProps> = ({ onSubmit, onCancel }) => {
  const formik = useFormik<AddAccountFormData>({
    initialValues,
    onSubmit,
  });

  return (
    <TableRow>
      <TableCell>
        <TextField name="name" value={formik.values.name} onChange={formik.handleChange} />
      </TableCell>
      <TableCell>
        <Select name="type" value={formik.values.type} onChange={formik.handleChange}>
          {Object.entries(AccountTypeEnum).map(([key, value]) => (
            <MenuItem key={value} value={value}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell>
        <Button onClick={formik.submitForm}>Submit</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </TableCell>
    </TableRow>
  );
};
