import { VFC } from 'react';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
export declare const TextField: VFC<MuiTextFieldProps>;
export declare type FormikTextFieldProps = Omit<MuiTextFieldProps, 'name' | 'value' | 'onChange'> & {
    name: string;
};
export declare const FormikTextField: VFC<FormikTextFieldProps>;
