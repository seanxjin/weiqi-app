import googleIcon from '@/shared/assets/auth/google.svg'
import githubIcon from '@/shared/assets/auth/github.svg'

export function OAuthOptions() {
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
