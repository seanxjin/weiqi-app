import { Link } from 'react-router'
import { OAuthOptions, signupLink } from '@/features/auth'
import { AuthLayout, AuthTerms } from '@/widgets/auth-layout'
import boardStillLife from '@/shared/assets/auth/board-still-life.png'
import emailLightIcon from '@/shared/assets/auth/email-light.svg'

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
