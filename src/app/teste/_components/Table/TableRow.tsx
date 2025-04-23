import { ReactNode } from 'react';

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}
