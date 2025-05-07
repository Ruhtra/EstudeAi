import { ReactNode, createContext, useContext } from "react";
import * as T from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useIsMutating } from "@tanstack/react-query";
import { useUserItemContext } from "@/app/teste4/UserMutationProvider";

// Root Table Component
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border">
      <T.Table>{children}</T.Table>
    </div>
  );
}

// Table Body Component
export function TableBody({ children }: { children: ReactNode }) {
  return <T.TableBody>{children}</T.TableBody>;
}

// Table Cell Component
export function TableCell({ children }: { children: ReactNode }) {
  const {
    deleteMutate: { isPending },
  } = useUserItemContext();

  const itemClasses = cn(
    "transition-opacity duration-200",
    isPending && "bg-red-500 opacity-50 pointer-events-none"
  );

  return <T.TableCell className={itemClasses}>{children}</T.TableCell>;
}

// Table Header Component
export function TableHeader({ children }: { children: ReactNode }) {
  return <T.TableHeader>{children}</T.TableHeader>;
}

// Table Head Component
export function TableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <T.TableHead className={className}>{children}</T.TableHead>;
}

// Table Row Component
export function TableRow({ children }: { children: ReactNode }) {
  return <T.TableRow>{children}</T.TableRow>;
}

// Exporting all components as ContentTable
export const ContentTable = {
  Root: Table,
  Header: TableHeader,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
};
