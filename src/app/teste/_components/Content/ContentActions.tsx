import { ReactNode } from 'react';

export function ContentActions({ children }: { children: ReactNode }) {
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
