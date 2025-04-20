import { ReactNode, useState } from 'react';

/* ---------------------
   COMPONENTES DE TABELA 
   (Padrão shadcn)
--------------------- */
interface TableProps {
  children: ReactNode;
}
export function Table({ children }: TableProps) {
  return <table className="w-full border-collapse text-sm">{children}</table>;
}

interface TableHeaderProps {
  headers: string[];
}
export function TableHeader({ headers }: TableHeaderProps) {
  return (
    <thead className="bg-gray-100">
      <tr>
        {headers.map((header, index) => (
          <th key={index} className="px-4 py-2 text-left font-medium text-gray-700 border-b">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
}
export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
}
export function TableRow({ children }: TableRowProps) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
}
export function TableCell({ children }: TableCellProps) {
  return <td className="px-4 py-2">{children}</td>;
}

/* ---------------------
   COMPONENTES DO CONTEÚDO
--------------------- */
// Root geral do Content
export function ContentRoot({ children }: { children: ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>;
}

// Layout: decide entre mobile ou desktop
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

/* MOBILE - ITEM (CARD) */
interface ContentItemMobileProps {
  expandable?: boolean;
  header: ReactNode;
  children?: ReactNode;
}
export function ContentItemMobile({ expandable, header, children }: ContentItemMobileProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>{header}</div>
        {expandable && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expanded ? 'Recolher' : 'Expandir'}
          </button>
        )}
      </div>
      {expanded && <div className="mt-2">{children}</div>}
    </div>
  );
}

/* DESKTOP - ITEM (LINHA DA TABELA) */
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

/* ACTIONS */
interface ContentActionsProps {
  children: ReactNode;
}
export function ContentActions({ children }: ContentActionsProps) {
  return <div className="flex gap-2">{children}</div>;
}

export function ContentActionsEdit() {
  return <button className="text-sm text-green-600 hover:underline">Editar</button>;
}

export function ContentActionsDelete() {
  return <button className="text-sm text-red-600 hover:underline">Excluir</button>;
}

export function ContentActionsPublish() {
  return <button className="text-sm text-indigo-600 hover:underline">Publicar</button>;
}

/* ---------------------
   EXPORTAÇÃO DOS COMPONENTES 
--------------------- */
export const ContentTable = {
  Root: Table,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
};

export const Content = {
  Root: ContentRoot,
  Layout: ContentLayout,
  Item: {
    Mobile: ContentItemMobile,
    Desktop: ContentItemDesktop,
  },
  Table: ContentTable,
  Actions: ContentActions,
  ActionsEdit: ContentActionsEdit,
  ActionsDelete: ContentActionsDelete,
  ActionsPublish: ContentActionsPublish,
};
