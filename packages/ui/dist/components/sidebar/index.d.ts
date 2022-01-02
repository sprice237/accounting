/// <reference types="react" />
export declare const Sidebar: {
    Category: import("react").FC<{
        name: string;
        icon?: JSX.Element | undefined;
        isCollapsable: boolean;
        badge?: string | number | undefined;
        button: true;
        to?: string | undefined;
        exact?: boolean | undefined;
    }>;
    Link: import("react").VFC<{
        name: string;
        to: string;
        badge?: string | number | undefined;
    }>;
    Section: import("styled-components").StyledComponent<import("@mui/material/OverridableComponent").OverridableComponent<import("@mui/material").TypographyTypeMap<{}, "span">>, any, {}, never>;
    Wrapper: import("react").FC<{}>;
};
