import { VFC } from 'react';
export declare type ConfirmationDialogProps = {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};
export declare const ConfirmationDialog: VFC<ConfirmationDialogProps>;
