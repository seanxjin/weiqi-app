import { createContext, useContext } from 'react'

export type Account = { id: string; username: string }

export type AuthState = {
  // undefined while loading, null when signed out.
  account: Account | null | undefined
  accountError: string | null
  reloadAccount: () => Promise<void>
  setAccount: (account: Account | null) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside AuthProvider')
  return auth
}
