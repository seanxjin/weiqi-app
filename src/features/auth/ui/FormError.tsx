import { errorMessage } from '../lib/errorMessage'

export function FormError({ error }: { error: unknown }) {
  return error ? (
    <p className="auth-error" role="alert">
      {errorMessage(error)}
    </p>
  ) : null
}
