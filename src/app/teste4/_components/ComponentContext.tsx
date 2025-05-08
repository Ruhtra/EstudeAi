// contexts/ContentContext.tsx
"use client";

import { createContext, useContext } from "react";
import {
  GenericMutationContextType,
  seilaOnome,
} from "./GenericMutationContext";

export const ContentContext = createContext<GenericMutationContextType | null>(
  null
);

export const useContentContext = () => {
  const ctx = useContext(ContentContext);
  if (!ctx)
    throw new Error(
      "useContentContext must be used inside ContentContext.Provider"
    );
  return ctx;
};

export const ContentItemContext = createContext<seilaOnome<any, any> | null>(
  null
);
export const useContentItemContext = () => {
  const ctx = useContext(ContentItemContext);
  if (!ctx)
    throw new Error(
      "useContentItemContext must be used inside ContentItemContext.Provider"
    );
  return ctx;
};
