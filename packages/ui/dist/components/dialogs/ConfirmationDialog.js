import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
export const ConfirmationDialog = ({ title, message, onConfirm, onCancel, }) => {
    return (_jsxs(Dialog, Object.assign({ open: true, onClose: onCancel }, { children: [title && _jsx(DialogTitle, { children: title }, void 0), _jsx(DialogContent, { children: _jsx(DialogContentText, { children: message }, void 0) }, void 0), _jsxs(DialogActions, { children: [_jsx(Button, Object.assign({ onClick: onCancel }, { children: "Cancel" }), void 0), _jsx(Button, Object.assign({ onClick: onConfirm, autoFocus: true }, { children: "Confirm" }), void 0)] }, void 0)] }), void 0));
};
