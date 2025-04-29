// contexts/ContentContext.tsx
'use client'

import { createContext, useContext } from 'react'
import { GenericMutationContextType } from './GenericMutationContext'

export const ContentContext = createContext<GenericMutationContextType<any, any, any, any, any, any, any, any> | null>(null)

export const useContentContext = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContentContext must be used inside ContentContext.Provider')
  return ctx
}