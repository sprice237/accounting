import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';

export const CenterVertically = styled.div<{ fullWidth?: boolean }>`
  height: 100%;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'initial')};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CenterHorizontally = styled.div<{ fullHeight?: boolean }>`
  width: 100%;
  height: ${({ fullHeight }) => (fullHeight ? '100%' : 'initial')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CenterContent = forwardRef<HTMLDivElement, { children?: ReactNode | undefined }>(
  ({ children }, ref) => (
    <CenterVertically fullWidth ref={ref}>
      <CenterHorizontally>{children}</CenterHorizontally>
    </CenterVertically>
  )
);
