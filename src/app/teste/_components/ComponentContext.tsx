// contexts/ContentContext.tsx
'use client'

import { createContext, useContext } from 'react'
import { GenericContextProps } from './GenericContext'

export const ContentContext = createContext<GenericContextProps<any> | null>(null)

export const useContentContext = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContentContext must be used inside ContentContext.Provider')
  return ctx
}