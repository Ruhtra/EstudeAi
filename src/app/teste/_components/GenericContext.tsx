// contexts/GenericContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

export type GenericContextProps<
  TDto,
  TCreateDto = any,
  TCreateReturn = TDto | void,
  TUpdateDto = any,
  TUpdateReturn = TDto | void,
  TDeleteDto = any,
  TDeleteReturn = TDto | void
> = {
  query: UseQueryResult<TDto[]>
  createMutation?: UseMutationResult<TCreateReturn, unknown, TCreateDto>
  updateMutation?: UseMutationResult<TUpdateReturn, unknown, TUpdateDto>
  deleteMutation?: UseMutationResult<TDeleteReturn, unknown, TDeleteDto>
}

export function createGenericContext<
  TDto,
  TCreateDto = any,
  TCreateReturn = TDto | void,
  TUpdateDto = any,
  TUpdateReturn = TDto | void,
  TDeleteDto = any,
  TDeleteReturn = TDto | void
>() {
  const Context = createContext<
    GenericContextProps<TDto, TCreateDto, TCreateReturn, TUpdateDto, TUpdateReturn, TDeleteDto, TDeleteReturn> | undefined
  >(undefined)

  const useGenericContext = () => {
    const context = useContext(Context)
    if (!context) throw new Error('Must be used inside Provider')
    return context
  }

  const Provider = ({
    children,
    value
  }: {
    children: ReactNode
    value: GenericContextProps<TDto, TCreateDto, TCreateReturn, TUpdateDto, TUpdateReturn, TDeleteDto, TDeleteReturn>
  }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return {
    Provider,
    useGenericContext
  }
}
