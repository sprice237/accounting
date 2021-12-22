import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
const StyledDrawer = styled('div') `
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${(props) => props.width}px;
    flex-shrink: 0;
  }
`;
export const DrawerWrapper = ({ children, width }) => {
    return _jsx(StyledDrawer, Object.assign({ width: width }, { children: children }), void 0);
};
