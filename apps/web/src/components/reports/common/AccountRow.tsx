import { VFC } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Big from 'big.js';
import { useFlagState } from '@sprice237/accounting-ui';

type AccountRowProps = {
  label: string;
  balance: Big;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  indentLevel: number;
  callout?: boolean;
};

export const AccountRow: VFC<AccountRowProps> = ({
  label,
  balance,
  onMouseEnter,
  onMouseLeave,
  onClick,
  indentLevel,
  callout = false,
}) => {
  const [isHover, setIsHover, clearIsHover] = useFlagState();

  const mouseEvents = {
    onMouseEnter: () => {
      setIsHover();
      onMouseEnter?.call(null);
    },
    onMouseLeave: () => {
      clearIsHover();
      onMouseLeave?.call(null);
    },
    onClick,
  };

  const style = {
    cursor: 'pointer',
    backgroundColor: callout || isHover ? 'lightsteelblue' : undefined,
  };

  return (
    <TableRow>
      <TableCell {...mouseEvents} style={style}>
        <div style={{ marginLeft: `${indentLevel * 15}px` }}>{label}</div>
      </TableCell>
      <TableCell {...mouseEvents} style={style}>
        <div style={{ textAlign: 'right', marginRight: `${indentLevel * 15}px` }}>
          {balance.toFixed(2)}
        </div>
      </TableCell>
    </TableRow>
  );
};
