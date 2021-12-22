import { VFC } from 'react';
export declare type SingleFileFieldProps = {
    onChange: (file: File | null) => void;
};
export declare const SingleFileField: VFC<SingleFileFieldProps>;
declare type FormikSingleFileFieldProps = {
    name: string;
};
export declare const FormikSingleFileField: VFC<FormikSingleFileFieldProps>;
export {};
