import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from '@mui/material/Modal';
import { CenterContent } from './CenterContent';
export const LoadingSpinner = () => (_jsx("div", { style: { display: 'inline-block' }, className: "loading" }, void 0));
export const LoadingModal = () => {
    return (_jsx(Modal, Object.assign({ open: true }, { children: _jsx(_Fragment, { children: _jsx(CenterContent, { children: _jsx(LoadingSpinner, {}, void 0) }, void 0) }, void 0) }), void 0));
};
export const LoadingOverlay = ({ isLoading, children }) => {
    return (_jsxs("div", Object.assign({ style: { position: 'relative' } }, { children: [_jsx("div", Object.assign({ style: { position: 'relative' } }, { children: children }), void 0), isLoading && (_jsx("div", Object.assign({ style: {
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                } }, { children: _jsx(LoadingSpinner, {}, void 0) }), void 0))] }), void 0));
};
