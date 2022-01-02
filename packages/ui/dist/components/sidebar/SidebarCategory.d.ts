import { FC } from 'react';
declare type SidebarCategoryProps = {
    name: string;
    icon?: JSX.Element;
    isCollapsable: boolean;
    badge?: string | number;
    button: true;
    to?: string;
    exact?: boolean;
};
export declare const SidebarCategory: FC<SidebarCategoryProps>;
export {};
