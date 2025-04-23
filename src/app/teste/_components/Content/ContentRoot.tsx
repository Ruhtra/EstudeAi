import { ReactNode } from 'react';

export function ContentRoot({ children }: { children: ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>;
}
