import { FC } from 'react';
import styled from 'styled-components';

const StyledDrawer = styled('div')<{ width: number }>`
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${(props) => props.width}px;
    flex-shrink: 0;
  }
`;

export const DrawerWrapper: FC<{ width: number }> = ({ children, width }) => {
  return <StyledDrawer width={width}>{children}</StyledDrawer>;
};
