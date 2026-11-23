import { useNavigate } from 'react-router'
import { useAuth, type Account } from '@/entities/session'
import { api } from '@/shared/api'

export function useSignIn() {
  const { setAccount } = useAuth()
  const navigate = useNavigate()
  return async (path: string, body: object) => {
    setAccount(await api<Account>(path, body))
    navigate('/play', { replace: true })
  }
}
