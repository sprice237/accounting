import { useField } from 'formik';
import { memo, VFC } from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export const TextField: VFC<MuiTextFieldProps> = memo(({ value, onChange, ...rest }) => {
  return (
    <MuiTextField
      variant="standard"
      {...rest}
      value={value}
      onChange={(e) => onChange?.call(null, e)}
    />
  );
});

export type FormikTextFieldProps = Omit<MuiTextFieldProps, 'name' | 'value' | 'onChange'> & {
  name: string;
};

export const FormikTextField: VFC<FormikTextFieldProps> = (props) => {
  const [field, meta] = useField(props.name);
  return (
    <TextField
      {...props}
      value={field.value}
      onChange={field.onChange}
      error={meta.touched && !!meta.error}
    />
  );
};
