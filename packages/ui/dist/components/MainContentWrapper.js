import styled from 'styled-components';
import MuiPaper from '@mui/material/Paper';
import { spacing } from '@mui/system';
const Paper = styled(MuiPaper)(spacing);
export const MainContentWrapper = styled(Paper) `
  flex: 1;
  background: ${(props) => props.theme.palette.background.default} !important;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;
