import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import styled from 'styled-components';
export const CenterVertically = styled.div `
  height: 100%;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'initial')};
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const CenterHorizontally = styled.div `
  width: 100%;
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'initial')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const CenterContent = forwardRef(({ children }, ref) => (_jsx(CenterVertically, Object.assign({ fullWidth: true, ref: ref }, { children: _jsx(CenterHorizontally, { children: children }, void 0) }), void 0)));
