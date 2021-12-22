export declare enum ThemeVariantEnum {
    DEFAULT = "DEFAULT",
    DARK = "DARK",
    LIGHT = "LIGHT",
    BLUE = "BLUE",
    GREEN = "GREEN",
    INDIGO = "INDIGO"
}
export declare const variants: Record<ThemeVariantEnum, VariantType>;
export declare type VariantType = {
    name: ThemeVariantEnum;
    palette: {
        primary: MainContrastTextType;
        secondary: MainContrastTextType;
    };
    header: ColorBgType & {
        search: {
            color: string;
        };
        indicator: {
            background: string;
        };
    };
    footer: ColorBgType;
    sidebar: ColorBgType & {
        header: ColorBgType & {
            brand: {
                color: string;
            };
        };
        footer: ColorBgType & {
            online: {
                background: string;
            };
        };
        badge: ColorBgType;
    };
};
declare type MainContrastTextType = {
    main: string;
    contrastText: string;
};
declare type ColorBgType = {
    color: string;
    background: string;
};
export {};
