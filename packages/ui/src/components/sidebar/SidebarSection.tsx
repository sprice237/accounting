import styled from 'styled-components';
import Typography from '@mui/material/Typography';

export const SidebarSection = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  padding: ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(7)}
    ${(props) => props.theme.spacing(1)};
  opacity: 0.9;
  display: block;
`;
