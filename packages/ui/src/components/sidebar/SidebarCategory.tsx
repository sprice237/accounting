import { useState, FC } from 'react';
import { rgba } from 'polished';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Category = styled(ListItem)`
  padding-top: ${(props) => props.theme.spacing(3)}px;
  padding-bottom: ${(props) => props.theme.spacing(3)}px;
  padding-left: ${(props) => props.theme.spacing(8)}px;
  padding-right: ${(props) => props.theme.spacing(7)}px;
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  cursor: pointer;

  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => props.theme.sidebar.color};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)}px;
  }
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
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

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;

type SidebarCategoryProps = {
  name: string;
  icon?: JSX.Element;
  isCollapsable: boolean;
  badge?: string | number;
  button: true;
  to?: string;
  exact?: boolean;
};

export const SidebarCategory: FC<SidebarCategoryProps> = ({
  name,
  icon,
  isCollapsable,
  badge,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = (): void => setIsOpen((oldIsOpen) => !oldIsOpen);

  return (
    <>
      <Category onClick={toggleIsOpen}>
        {icon}
        <CategoryText>{name}</CategoryText>
        {isCollapsable ? isOpen ? <CategoryIconMore /> : <CategoryIconLess /> : null}
        {badge ? <CategoryBadge label={badge} /> : ''}
      </Category>
      {isCollapsable && children && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
};
