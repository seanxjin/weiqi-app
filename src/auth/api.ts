import { createContext, useContext } from 'react'

export class ApiError extends Error {
  code: string
  status: number
  retryAfter: number | undefined

  constructor(code: string, message: string, status: number, retryAfter?: number) {
    super(message)
    this.code = code
    this.status = status
    this.retryAfter = retryAfter
  }
}

// Calls the backend through the Vite /api proxy, so the session cookie is same-origin.
export async function api<T = unknown>(path: string, body?: object, method = 'POST'): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  let json
  try {
    json = text ? JSON.parse(text) : undefined
  } catch {
    throw new ApiError(
      'HTTP_ERROR',
      'The server returned an unexpected response. Please try again.',
      response.status,
    )
  }
  if (!response.ok) {
    const retryAfter = Number(response.headers.get('retry-after'))
    throw new ApiError(
      json?.error ?? 'HTTP_ERROR',
      json?.message ?? 'The request could not be completed. Please try again.',
      response.status,
      retryAfter > 0 ? retryAfter : undefined,
    )
  }
  return json as T
}

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
