import { useState } from 'react'
import { Link } from 'react-router'
import {
  field,
  FormError,
  passwordGuidance,
  signInLink,
  usernamePattern,
  useSubmit,
  validateNewPassword,
} from '@/features/auth'
import { api } from '@/shared/api'
import { AuthField, AuthLayout, AuthPasswordField, AuthTerms } from '@/widgets/auth-layout'
import emailIcon from '@/shared/assets/auth/email.svg'
import usernameIcon from '@/shared/assets/auth/username.svg'

export function SignupPage() {
  const [sent, setSent] = useState(false)
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    const password = field(form, 'password')
    validateNewPassword(password)
    await api(
      '/auth/signup',
      {
        username: field(form, 'username'),
        email: field(form, 'email'),
        password,
      },
      'POST',
    )
    setSent(true)
  })

  return (
    <AuthLayout title="Email signup" backTo="/signup" accountLink={signInLink}>
      <div data-node-id="86:2">
        <div className="auth-heading">
          <p className="auth-eyebrow">MAKE YOUR FIRST MOVE</p>
          <h1>{sent ? 'Check your email' : 'Create your account'}</h1>
          <p className="auth-subtitle">
            {sent
              ? 'Confirm your email to take your place at the board.'
              : 'A place at the board, made for you.'}
          </p>
        </div>
        {sent ? (
          <>
            <p className="auth-status" role="status">
              We sent a confirmation link. Follow it to finish creating your account. The link is
              valid for 24 hours.
            </p>
            <div className="auth-links">
              <Link to="/signup/resend">Resend or correct your email</Link>
              <Link to="/login">Sign in</Link>
            </div>
          </>
        ) : (
          <>
            <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
              <AuthField
                name="username"
                label="USERNAME"
                icon={usernameIcon}
                placeholder="Choose a username"
                autoComplete="username"
                minLength={2}
                maxLength={20}
                pattern={usernamePattern}
                title="2–20 letters or digits, with single underscores or hyphens between them."
                guidance="Please choose an appropriate username. Inappropriate usernames will be flagged by our moderators."
                required
              />
              <AuthField
                name="email"
                label="EMAIL"
                icon={emailIcon}
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                maxLength={254}
                required
              />
              <AuthPasswordField
                name="password"
                label="PASSWORD"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                guidance={passwordGuidance}
                required
              />
              <FormError error={error} />
              <button className="auth-action" disabled={pending}>
                {pending ? 'Creating account…' : 'Continue'}
              </button>
            </form>
            <AuthTerms />
          </>
        )}
      </div>
    </AuthLayout>
  )
}
