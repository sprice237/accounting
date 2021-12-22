import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
import { shadows } from './shadows';
import { typography } from './typography';
import { ThemeVariantEnum, variants } from './variants';
const themeConfig = variants[ThemeVariantEnum.DEFAULT];
const theme = createTheme({
    spacing: 4,
    breakpoints,
    typography,
    shadows,
    palette: themeConfig.palette,
}, {
    name: themeConfig.name,
    header: themeConfig.header,
    footer: themeConfig.footer,
    sidebar: themeConfig.sidebar,
});
export const AppThemeProvider = ({ children }) => {
    return (_jsx(MuiThemeProvider, Object.assign({ theme: theme }, { children: _jsx(StyledComponentsThemeProvider, Object.assign({ theme: theme }, { children: children }), void 0) }), void 0));
};
