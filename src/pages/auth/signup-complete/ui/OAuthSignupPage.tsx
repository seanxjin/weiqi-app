import { Link, useSearchParams } from 'react-router'
import {
  field,
  FormError,
  signInLink,
  usernamePattern,
  useSignIn,
  useSubmit,
} from '@/features/auth'
import { AuthField, AuthLayout, AuthTerms } from '@/widgets/auth-layout'
import usernameIcon from '@/shared/assets/auth/username.svg'

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
