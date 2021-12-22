import { jsx as _jsx } from "react/jsx-runtime";
import { useField } from 'formik';
export const SingleFileField = ({ onChange }) => {
    return _jsx("input", { type: "file", onChange: (e) => { var _a, _b; return onChange((_b = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null); } }, void 0);
};
export const FormikSingleFileField = (props) => {
    const [, , fieldHelpers] = useField(props.name);
    const onChange = (file) => {
        fieldHelpers.setValue(file);
    };
    return _jsx(SingleFileField, { onChange: onChange }, void 0);
};
