"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme={window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark": "light"}
      themes={["light", "dark"]}
      enableSystem={false}
      storageKey="theme"
    >
      {children}
    </NextThemesProvider>
  )
}