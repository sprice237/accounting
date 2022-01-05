import { useFormik } from 'formik';
import { VFC } from 'react';

import Button from '@mui/material/Button';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@sprice237/accounting-ui';

type AddAccountTableRowProps = {
  onCancel: () => void;
  onSubmit: (formData: AddAccountFormData) => void;
};

export type AddAccountFormData = {
  name: string;
};

const initialValues: AddAccountFormData = {
  name: '',
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
        <Button onClick={formik.submitForm}>Submit</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </TableCell>
    </TableRow>
  );
};
