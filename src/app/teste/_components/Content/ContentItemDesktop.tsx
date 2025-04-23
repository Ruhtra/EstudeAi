import { ReactNode } from 'react';
import { TableRow } from '../Table/TableRow';
import { TableCell } from '../Table/TableCell';

interface ContentItemDesktopProps {
  cells: ReactNode[];
}

export function ContentItemDesktop({ cells }: ContentItemDesktopProps) {
  return (
    <TableRow>
      {cells.map((cell, index) => (
        <TableCell key={index}>{cell}</TableCell>
      ))}
    </TableRow>
  );
}
