var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useField } from 'formik';
import { memo } from 'react';
import MuiTextField from '@mui/material/TextField';
export const TextField = memo((_a) => {
    var { value, onChange } = _a, rest = __rest(_a, ["value", "onChange"]);
    return (_jsx(MuiTextField, Object.assign({ variant: "standard" }, rest, { value: value, onChange: (e) => onChange === null || onChange === void 0 ? void 0 : onChange.call(null, e) }), void 0));
});
export const FormikTextField = (props) => {
    const [field, meta] = useField(props.name);
    return (_jsx(TextField, Object.assign({}, props, { value: field.value, onChange: field.onChange, error: meta.touched && !!meta.error }), void 0));
};
