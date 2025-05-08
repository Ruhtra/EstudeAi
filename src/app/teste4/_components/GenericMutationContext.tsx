"use client";

import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import React, { Children, createContext, useContext } from "react";

export type GenericMutationContextType<TQueryResult> = {
  useFetchQuery: UseQueryResult<TQueryResult, Error>;
  useCreateMutation: () => UseMutationResult<any, Error, any, unknown>;
  useUpdateMutation: (
    id: string
  ) => UseMutationResult<any, Error, any, unknown>;
  useDeleteMutation: (
    id: string
  ) => UseMutationResult<any, Error, any, unknown>;
};

export function createGenericContext() {
  const Context = createContext<GenericMutationContextType | null>(null);

  const useGenericContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("Must be used within a Provider");
    return context;
  };

  const Provider = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: GenericMutationContextType;
  }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Provider,
    useGenericContext,
  };
}

export type seilaOnome<TDeleteInput, TDeleteOutput> = {
  id: string;
  deleteMutate: UseMutationResult<TDeleteOutput, Error, TDeleteInput, unknown>;
};
export function createGenericItemContext<TDeleteInput, TDeleteOutput>() {
  // Context to share the `id` across components
  const ItemContext = createContext<seilaOnome<TDeleteInput, TDeleteOutput>>(
    {} as seilaOnome<TDeleteInput, TDeleteOutput>
  );

  // Hook to use the TableContext
  const useGenericItemContext = () => {
    const context = useContext(ItemContext);
    if (!context)
      throw new Error("useTableContext must be used within a TableProvider");

    return context;
  };

  const Provider = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: seilaOnome<TDeleteInput, TDeleteOutput>;
  }) => {
    return (
      <ItemContext.Provider value={value}>{children}</ItemContext.Provider>
    );
  };

  return {
    Provider,
    useGenericItemContext,
  };
}
