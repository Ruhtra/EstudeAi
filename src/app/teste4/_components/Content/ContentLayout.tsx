import { ReactNode } from 'react';

interface ContentLayoutProps {
  isMobile: boolean;
  children: ReactNode;
}

export function ContentLayout({ isMobile, children }: ContentLayoutProps) {
  return isMobile ? (
    <div className="space-y-4">{children}</div>
  ) : (
    children
  );
}
