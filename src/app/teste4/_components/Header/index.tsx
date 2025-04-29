import { ReactNode } from 'react';

export function HeaderRoot({ children }: { children: ReactNode }) {
  return (
    <> {children} </>
  );
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold mb-3">{children}</h1>
}

export function HeaderContent({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  Content: HeaderContent
};
