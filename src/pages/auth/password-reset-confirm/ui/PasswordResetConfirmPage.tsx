import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  field,
  FormError,
  passwordGuidance,
  useSignIn,
  useSubmit,
  validateNewPassword,
} from '@/features/auth'
import { api, ApiError } from '@/shared/api'
import { AuthField, AuthLayout, AuthPasswordField } from '@/widgets/auth-layout'

type ResetInfo = { username: string; twoFactor: boolean }

export function PasswordResetConfirmPage() {
  const signIn = useSignIn()
  const { token = '' } = useParams()
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<{
    token: string
    attempt: number
    info?: ResetInfo
    error?: unknown
  } | null>(null)
  const current = loaded?.token === token && loaded.attempt === attempt ? loaded : null
  const resetPath = `/auth/password-reset/${encodeURIComponent(token)}`
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const info = await api<ResetInfo>(
          `/auth/password-reset/${encodeURIComponent(token)}`,
          undefined,
          'GET',
        )
        if (active) setLoaded({ token, attempt, info })
      } catch (error) {
        if (active) setLoaded({ token, attempt, error })
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [token, attempt])
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    if (!current?.info) return
    const password = field(form, 'password')
    validateNewPassword(password)
    await signIn(resetPath, {
      password,
      ...(current.info.twoFactor && { totp: field(form, 'totp') }),
    })
  })
  return (
    <AuthLayout title="Set a new password" backTo="/login">
      <div className="auth-heading">
        <h1>Set a new password</h1>
        <p className="auth-subtitle">
          {current?.info
            ? `Reset the password for ${current.info.username}.`
            : 'Return to the board with a fresh start.'}
        </p>
      </div>
      {!current ? (
        <p className="auth-status" role="status">
          Checking your reset link…
        </p>
      ) : current.info ? (
        <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
          <AuthPasswordField
            name="password"
            label="NEW PASSWORD"
            placeholder="Create a new password"
            autoComplete="new-password"
            minLength={8}
            guidance={passwordGuidance}
            required
          />
          {current.info.twoFactor && (
            <AuthField
              name="totp"
              label="AUTHENTICATOR CODE"
              placeholder="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          )}
          <FormError error={error} />
          <button className="auth-action" disabled={pending}>
            {pending ? 'Saving…' : 'Save and continue'}
          </button>
          <div className="auth-links">
            <Link to="/password-reset">Request a new reset link</Link>
          </div>
        </form>
      ) : (
        <div className="auth-form">
          <FormError error={current.error} />
          {!(current.error instanceof ApiError && current.error.code === 'INVALID_TOKEN') && (
            <button className="auth-action" onClick={() => setAttempt((value) => value + 1)}>
              Try again
            </button>
          )}
          <div className="auth-links">
            <Link to="/password-reset">Request a new reset link</Link>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
