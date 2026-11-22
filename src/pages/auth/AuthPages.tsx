import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { api, ApiError, useAuth, type Account } from '../../auth/api'
import { AuthField, AuthLayout, AuthPasswordField, AuthTerms } from './AuthLayout'
import boardStillLife from '../../assets/auth/board-still-life.png'
import emailLightIcon from '../../assets/auth/email-light.svg'
import emailIcon from '../../assets/auth/email.svg'
import usernameIcon from '../../assets/auth/username.svg'
import googleIcon from '../../assets/auth/google.svg'
import githubIcon from '../../assets/auth/github.svg'

const field = (form: FormData, name: string) => String(form.get(name) ?? '')
const usernamePattern = '[A-Za-z0-9]+(?:[_-]?[A-Za-z0-9]+)*'
const passwordGuidance = 'Use at least 8 characters and no more than 72 UTF-8 bytes.'
const signInLink = { prompt: 'Already a member?', label: 'Sign in', to: '/login' }
const signupLink = { prompt: 'New to baduk?', label: 'Sign up', to: '/signup' }

function validateNewPassword(password: string) {
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.')
  if (new TextEncoder().encode(password).length > 72) {
    throw new Error('Your password must not exceed 72 UTF-8 bytes.')
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status >= 500) return 'The server is unavailable. Please try again.'
    const messages: Record<string, string> = {
      INVALID_CREDENTIALS: 'The username, email, or password is incorrect.',
      TWO_FACTOR_REQUIRED: 'Enter the 6-digit code from your authenticator to continue.',
      INVALID_TWO_FACTOR: 'That authenticator code is incorrect. Please try again.',
      EMAIL_UNCONFIRMED: 'Please confirm your email address before signing in.',
      ACCOUNT_CLOSED: 'This account is closed and cannot sign in.',
      USERNAME_TAKEN: 'That username is already in use. Please choose another.',
      EMAIL_TAKEN: 'That email address is already in use.',
      INVALID_TOKEN: 'This link is invalid or has expired. Request a new email to continue.',
      UNAUTHORIZED: 'Your sign-in session has expired. Please start again.',
      CONFLICT: 'Your signup could not be completed. Please start again.',
      FORBIDDEN: 'This request was blocked. Please refresh the page and try again.',
    }
    if (error.code === 'RATE_LIMITED') {
      return error.retryAfter
        ? `Too many attempts. Please wait ${Math.ceil(error.retryAfter)} seconds before trying again.`
        : 'Too many attempts. Please wait before trying again.'
    }
    return messages[error.code] ?? error.message
  }
  if (error instanceof TypeError)
    return 'Unable to reach the server. Check your connection and try again.'
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

function useSubmit(action: (form: FormData) => Promise<void>) {
  const [error, setError] = useState<unknown>(null)
  const [pending, setPending] = useState(false)
  const submitting = useRef(false)
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    const form = new FormData(event.currentTarget)
    submitting.current = true
    setPending(true)
    setError(null)
    try {
      await action(form)
    } catch (caught) {
      setError(caught)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }
  return { error, pending, onSubmit }
}

function useSignIn() {
  const { setAccount } = useAuth()
  const navigate = useNavigate()
  return async (path: string, body: object) => {
    setAccount(await api<Account>(path, body))
    navigate('/play', { replace: true })
  }
}

function FormError({ error }: { error: unknown }) {
  return error ? (
    <p className="auth-error" role="alert">
      {errorMessage(error)}
    </p>
  ) : null
}

function OAuthOptions() {
  return (
    <>
      <div className="auth-divider">OR</div>
      <div className="auth-providers">
        <a className="auth-provider" href="/api/auth/oauth/google?redirect=/play">
          <img src={googleIcon} alt="" />
          Continue with Google
        </a>
        <a className="auth-provider" href="/api/auth/oauth/github?redirect=/play">
          <img src={githubIcon} alt="" />
          Continue with GitHub
        </a>
      </div>
    </>
  )
}

export function SignupOptionsPage() {
  return (
    <AuthLayout title="Create your account" accountLink={signupLink}>
      <div data-node-id="84:2">
        <div className="auth-heading">
          <h1>Create Your Baduk Account</h1>
        </div>
        <img
          className="auth-still-life"
          src={boardStillLife}
          alt="Go stones on a kaya wood board"
        />
        <Link className="auth-action" to="/signup/email">
          <img src={emailLightIcon} alt="" />
          Continue with Email
        </Link>
        <OAuthOptions />
        <AuthTerms />
      </div>
    </AuthLayout>
  )
}

export function LoginPage() {
  const signIn = useSignIn()
  const [params] = useSearchParams()
  const [needsTotp, setNeedsTotp] = useState(false)
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    try {
      await signIn('/auth/login', {
        login: field(form, 'login'),
        password: field(form, 'password'),
        ...(needsTotp && { totp: field(form, 'totp') }),
      })
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'TWO_FACTOR_REQUIRED') setNeedsTotp(true)
      throw caught
    }
  })
  const oauthError = params.get('error')
  const oauthMessage =
    oauthError === 'email_in_use'
      ? 'This provider email belongs to an existing account. Sign in with that account instead.'
      : oauthError
        ? 'Social sign-in could not be completed. Please try again.'
        : null

  return (
    <AuthLayout title="Sign in" accountLink={signupLink}>
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Your place at the board is waiting.</p>
      </div>
      <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
        {oauthMessage && (
          <p className="auth-error" role="alert">
            {oauthMessage}
          </p>
        )}
        <AuthField
          name="login"
          label="USERNAME OR EMAIL"
          icon={usernameIcon}
          placeholder="Username or email"
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
        {needsTotp && (
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
        {error instanceof ApiError && error.code === 'EMAIL_UNCONFIRMED' && (
          <div className="auth-links">
            <Link to="/signup/resend">Resend or correct confirmation email</Link>
          </div>
        )}
        <button className="auth-action" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="auth-links">
          <Link to="/password-reset">Forgot password?</Link>
        </div>
      </form>
      <OAuthOptions />
    </AuthLayout>
  )
}

export function SignupPage() {
  const [sent, setSent] = useState(false)
  const { error, pending, onSubmit } = useSubmit(async (form) => {
    const password = field(form, 'password')
    validateNewPassword(password)
    await api('/auth/signup', {
      username: field(form, 'username'),
      email: field(form, 'email'),
      password,
    }, "POST");
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

export function SignupConfirmPage() {
  const signIn = useSignIn()
  const { token = '' } = useParams()
  const { error, pending, onSubmit } = useSubmit(() => signIn('/auth/signup/confirm', { token }))
  return (
    <AuthLayout title="Confirm your account" accountLink={signInLink}>
      <div className="auth-heading">
        <h1>Welcome to Baduk</h1>
        <p className="auth-subtitle">Confirm your email address to finish creating your account.</p>
      </div>
      <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
        <FormError error={error} />
        <button className="auth-action" disabled={pending}>
          {pending ? 'Confirming…' : 'Confirm and continue'}
        </button>
        <div className="auth-links">
          <Link to="/signup/resend">Request a new confirmation link</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export function OAuthSignupPage() {
  const signIn = useSignIn()
  const [params] = useSearchParams()
  const { error, pending, onSubmit } = useSubmit((form) =>
    signIn('/auth/oauth/complete', { username: field(form, 'username') }),
  )
  return (
    <AuthLayout title="Choose your username" backTo="/signup" accountLink={signInLink}>
      <div className="auth-heading">
        <p className="auth-eyebrow">MAKE YOUR FIRST MOVE</p>
        <h1>Choose a username</h1>
        <p className="auth-subtitle">One last step before you join the board.</p>
      </div>
      <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
        <AuthField
          name="username"
          label="USERNAME"
          icon={usernameIcon}
          defaultValue={params.get('username') ?? ''}
          placeholder="Choose a username"
          autoComplete="username"
          minLength={2}
          maxLength={20}
          pattern={usernamePattern}
          title="2–20 letters or digits, with single underscores or hyphens between them."
          required
        />
        <FormError error={error} />
        <button className="auth-action" disabled={pending}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
        <div className="auth-links">
          <Link to="/signup">Start signup again</Link>
        </div>
      </form>
      <AuthTerms />
    </AuthLayout>
  )
}

export function TwoFactorLoginPage() {
  const signIn = useSignIn()
  const { error, pending, onSubmit } = useSubmit((form) =>
    signIn('/auth/two-factor', { code: field(form, 'code') }),
  )
  return (
    <AuthLayout title="Two-factor authentication" backTo="/login">
      <div className="auth-heading">
        <h1>Verify it is you</h1>
        <p className="auth-subtitle">
          Enter the code from your authenticator to finish signing in.
        </p>
      </div>
      <form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
        <AuthField
          name="code"
          label="AUTHENTICATOR CODE"
          placeholder="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />
        <FormError error={error} />
        <button className="auth-action" disabled={pending}>
          {pending ? 'Verifying…' : 'Verify and continue'}
        </button>
        <div className="auth-links">
          <Link to="/login">Start sign-in again</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

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
