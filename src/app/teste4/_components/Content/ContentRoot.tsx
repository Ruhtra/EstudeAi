// import { ReactNode } from 'react';

// export function ContentRoot({ children }: { children: ReactNode }) {
//   return ;
// }

// components/Content/Root.tsx
"use client";

import { ContentContext } from "../ComponentContext";
import { GenericMutationContextType } from "../GenericMutationContext";

type ContentRootProps = {
  children: React.ReactNode;
  context: GenericMutationContextType;
};

export function ContentRoot({ children, context }: ContentRootProps) {
  return (
    <ContentContext.Provider value={context}>
      <div className="p-4 space-y-4">{children}</div>
    </ContentContext.Provider>
  );
}
