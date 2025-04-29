'use client'

import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

export type GenericMutationContextType<TFetchInput, TFetchOutput,TCreateInput, TCreateOutput, TUpdateInput, TUpdateOutput, TDeleteInput, TDeleteOutput> = {
  useFetchQuery: UseQueryResult<TFetchOutput, Error>
  useCreateMutation: () => UseMutationResult<TCreateOutput, Error, TCreateInput, unknown>
  useUpdateMutation: () => UseMutationResult<TUpdateOutput, Error, TUpdateInput, unknown>
  useDeleteMutation: () => UseMutationResult<TDeleteOutput, Error, TDeleteInput, unknown>
}

export function createGenericContext<TFetchInput, TFetchOutput,TCreateInput, TCreateOutput, TUpdateInput, TUpdateOutput, TDeleteInput, TDeleteOutput>() {
  const Context = createContext<GenericMutationContextType<TFetchInput, TFetchOutput,TCreateInput, TCreateOutput, TUpdateInput, TUpdateOutput, TDeleteInput, TDeleteOutput> | null>(null);

  const useGenericContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("Must be used within a Provider");
    return context;
  };

  const Provider = ({
    children,
    value
  }: {
    children: React.ReactNode
    value: GenericMutationContextType<TFetchInput, TFetchOutput,TCreateInput, TCreateOutput, TUpdateInput, TUpdateOutput, TDeleteInput, TDeleteOutput>
  }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Provider,
    useGenericContext
  };
}