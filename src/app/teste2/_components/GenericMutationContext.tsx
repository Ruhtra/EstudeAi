'use client'

import { createContext, useContext } from "react";

type GenericMutationContextType<TCreateArgs, TDeleteArgs> = {
  useCreateMutation: () => {
    mutate: (args: TCreateArgs) => void
  };
  getDeleteMutation: (args: TDeleteArgs) => {
    mutate: () => void; isPending: boolean
  };
};

export const GenericMutationContext = createContext<GenericMutationContextType<any, any> | null>(null);

export const useGenericMutationContext = <TCreateArgs, TDeleteArgs>() => {
  const context = useContext(GenericMutationContext);
  if (!context) throw new Error("Must be used within a Provider");
  return context as GenericMutationContextType<TCreateArgs, TDeleteArgs>;
};
