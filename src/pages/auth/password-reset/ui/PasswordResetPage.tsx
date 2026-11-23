import { useState } from 'react'
import { Link } from 'react-router'
import { field, FormError, signInLink, useSubmit } from '@/features/auth'
import { api } from '@/shared/api'
import { AuthField, AuthLayout } from '@/widgets/auth-layout'
import emailIcon from '@/shared/assets/auth/email.svg'

export function PasswordResetPage() {
  const [sent, setSent] = useState(false)
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    await api('/auth/password-reset', { email: field(form, 'email') })
    setSent(true)
  })
  return (
    <AuthLayout title="Reset password" backTo="/login" accountLink={signInLink}>
      <div className="auth-heading">
        <h1>{sent ? 'Check your email' : 'Forgot your password?'}</h1>
        <p className="auth-subtitle">We will help you get back to the board.</p>
      </div>
      {sent ? (
        <>
          <p className="auth-status" role="status">
            If an account uses this email address, a password reset link has been sent. The link is
            valid for 1 hour.
          </p>
          <div className="auth-links">
            <Link to="/login">Return to sign in</Link>
          </div>
        </>
      ) : (
        <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
          <AuthField
            name="email"
            label="EMAIL"
            icon={emailIcon}
            type="email"
            placeholder="Enter your account email"
            autoComplete="email"
            maxLength={254}
            required
          />
          <FormError error={error} />
          <button className="auth-action" disabled={pending}>
            {pending ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
