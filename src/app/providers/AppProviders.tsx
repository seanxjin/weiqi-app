import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/entities/session'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )
}
