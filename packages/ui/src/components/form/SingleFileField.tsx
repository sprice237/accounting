import { useField } from 'formik';
import { VFC } from 'react';

export type SingleFileFieldProps = {
  onChange: (file: File | null) => void;
};

export const SingleFileField: VFC<SingleFileFieldProps> = ({ onChange }) => {
  return <input type="file" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />;
};

type FormikSingleFileFieldProps = {
  name: string;
};

export const FormikSingleFileField: VFC<FormikSingleFileFieldProps> = (props) => {
  const [, , fieldHelpers] = useField<File | null>(props.name);

  const onChange = (file: File | null) => {
    fieldHelpers.setValue(file);
  };

  return <SingleFileField onChange={onChange} />;
};
