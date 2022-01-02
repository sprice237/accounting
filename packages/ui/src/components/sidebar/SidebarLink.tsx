import { NavLink } from 'react-router-dom';
import { rgba, darken } from 'polished';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { VFC } from 'react';

const Link = styled(ListItem)<{
  component: typeof NavLink;
  exact: boolean;
  to: string;
}>`
  padding-left: ${(props) => props.theme.spacing(17.5)}px;
  padding-top: ${(props) => props.theme.spacing(2)}px;
  padding-bottom: ${(props) => props.theme.spacing(2)}px;

  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.7)};
  }

  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }

  &:hover {
    background-color: ${(props) => darken(0.015, props.theme.sidebar.background)};
  }

  &.active {
    background-color: ${(props) => darken(0.03, props.theme.sidebar.background)};

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${(props) => props.theme.sidebar.color};
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 28px;
  top: 8px;
  background: ${(props) => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

type SidebarLinkProps = {
  name: string;
  to: string;
  badge?: string | number;
};

export const SidebarLink: VFC<SidebarLinkProps> = ({ name, to, badge }) => {
  return (
    <Link dense component={NavLink} exact to={to}>
      <LinkText>{name}</LinkText>
      {badge ? <LinkBadge label={badge} /> : ''}
    </Link>
  );
};
