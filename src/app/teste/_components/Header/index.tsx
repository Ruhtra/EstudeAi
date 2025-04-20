import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function HeaderRoot({ children }: { children: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
      {children}
    </header>
  );
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-xl font-bold text-zinc-900">{children}</h1>;
}

interface HeaderBackButtonProps {
  show?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HeaderBackButton({ show = true, onClick, className }: HeaderBackButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className={twMerge("text-sm text-blue-600 hover:underline", className)}
    >
      Voltar
    </button>
  );
}

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  BackButton: HeaderBackButton,
};
