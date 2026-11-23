import { useState } from 'react'
import { Link } from 'react-router'
import { field, FormError, signInLink, useSubmit } from '@/features/auth'
import { api } from '@/shared/api'
import { AuthField, AuthLayout, AuthPasswordField } from '@/widgets/auth-layout'
import emailIcon from '@/shared/assets/auth/email.svg'
import usernameIcon from '@/shared/assets/auth/username.svg'

export function ResendConfirmationPage() {
  const [sent, setSent] = useState(false)
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    await api('/auth/signup/fix-email', {
      login: field(form, 'login'),
      password: field(form, 'password'),
      email: field(form, 'email'),
    })
    setSent(true)
  })
  return (
    <AuthLayout title="Confirmation email" backTo="/login" accountLink={signInLink}>
      <div className="auth-heading">
        <h1>{sent ? 'Check your email' : 'Confirm your email'}</h1>
        <p className="auth-subtitle">
          Resend your confirmation link or correct your email address.
        </p>
      </div>
      {sent ? (
        <>
          <p className="auth-status" role="status">
            If the account details are correct and confirmation is still needed, a new email has
            been sent.
          </p>
          <div className="auth-links">
            <Link to="/login">Return to sign in</Link>
          </div>
        </>
      ) : (
        <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
          <AuthField
            name="login"
            label="USERNAME OR CURRENT EMAIL"
            icon={usernameIcon}
            placeholder="Username or current email"
            autoComplete="username"
            maxLength={254}
            required
          />
          <AuthPasswordField
            name="password"
            label="PASSWORD"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <AuthField
            name="email"
            label="SEND TO EMAIL"
            icon={emailIcon}
            type="email"
            placeholder="Enter the correct email address"
            autoComplete="email"
            maxLength={254}
            required
          />
          <FormError error={error} />
          <button className="auth-action" disabled={pending}>
            {pending ? 'Sending…' : 'Send confirmation link'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
