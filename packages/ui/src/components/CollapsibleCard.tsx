import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MuiCardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useToggleState } from '$/hooks';

export const CardHeader = styled(MuiCardHeader)`
  cursor: pointer;
`;

type CollapsibleCardProps = {
  className?: string;
  initialOpen?: boolean;
  title: string;
  children?: ReactNode | undefined;
};

export const CollapsibleCard = forwardRef<HTMLDivElement, CollapsibleCardProps>(
  ({ className, initialOpen = false, title, children }, ref) => {
    const [isOpen, toggleOpen] = useToggleState(initialOpen);

    return (
      <Card ref={ref} className={className}>
        <CardHeader
          title={title}
          onClick={toggleOpen}
          action={isOpen ? <ExpandLess /> : <ExpandMore />}
        />
        <Collapse in={isOpen}>
          <CardContent>{children}</CardContent>
        </Collapse>
      </Card>
    );
  }
);
