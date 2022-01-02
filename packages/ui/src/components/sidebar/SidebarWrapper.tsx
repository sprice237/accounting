import styled from 'styled-components';
import MuiDrawer from '@mui/material/Drawer';
import MuiList from '@mui/material/List';
import { DrawerWrapper } from '$cmp/DrawerWrapper';
import { FC } from 'react';

const SIDEBAR_WIDTH = 258;

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled.div`
  background-color: ${(props) => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
  overflow: auto;
`;

const List = styled(MuiList)`
  background-color: ${(props) => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

export const SidebarWrapper: FC = ({ children }) => {
  return (
    <DrawerWrapper width={SIDEBAR_WIDTH}>
      <Drawer variant="permanent" PaperProps={{ style: { width: SIDEBAR_WIDTH } }}>
        <Scrollbar>
          <List disablePadding>
            <Items>{children}</Items>
          </List>
        </Scrollbar>
      </Drawer>
    </DrawerWrapper>
  );
};
