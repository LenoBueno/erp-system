'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

type ThemeProviderProps = {
  children: React.ReactNode;
  [prop: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="e-ink" 
      enableSystem={false}
      themes={['light', 'dark', 'e-ink']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
