// contexts/GenericContext.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'

export type GenericContextProps<
  TDto,
  TCreateDto = any,
  TUpdateDto = any
> = {
  query: UseQueryResult<TDto[]>
  createMutation?: UseMutationResult<TDto, unknown, TCreateDto>
  updateMutation?: UseMutationResult<TDto, unknown, TUpdateDto>
  deleteMutation?: UseMutationResult<void, unknown, string>
}

export function createGenericContext<
  TDto,
  TCreateDto = any,
  TUpdateDto = any
>() {
  const Context = createContext<GenericContextProps<TDto, TCreateDto, TUpdateDto> | undefined>(
    undefined
  )

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
    value: GenericContextProps<TDto, TCreateDto, TUpdateDto>
  }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return {
    Provider,
    useGenericContext
  }
}
