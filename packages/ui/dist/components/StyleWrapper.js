import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createGlobalStyle } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { AppThemeProvider } from "../theme";
const GlobalStyle = createGlobalStyle `
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.palette.background.default};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;
export const StyleWrapper = ({ children }) => {
    return (_jsxs(AppThemeProvider, { children: [_jsx(CssBaseline, {}, void 0), _jsx(GlobalStyle, {}, void 0), children] }, void 0));
};
