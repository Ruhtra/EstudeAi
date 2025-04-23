import { ReactNode } from 'react';

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}