import { Route, Routes } from 'react-router'
import { AppLayout } from '@/widgets/app-shell'
import { GameSetupPage } from '@/pages/game-setup'
import { GoHomePage } from '@/pages/go-home'
import { LocalPlayPage } from '@/pages/local-play'
import { MaterialLibraryPage } from '@/pages/material-library'
import { WelcomePage } from '@/pages/welcome'
import { LoginPage } from '@/pages/auth/login'
import { OAuthSignupPage } from '@/pages/auth/signup-complete'
import { PasswordResetConfirmPage } from '@/pages/auth/password-reset-confirm'
import { PasswordResetPage } from '@/pages/auth/password-reset'
import { ResendConfirmationPage } from '@/pages/auth/signup-resend'
import { SignupConfirmPage } from '@/pages/auth/signup-confirm'
import { SignupOptionsPage } from '@/pages/auth/signup-options'
import { SignupPage } from '@/pages/auth/signup'
import { TwoFactorLoginPage } from '@/pages/auth/two-factor-login'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/two-factor" element={<TwoFactorLoginPage />} />
      <Route path="/signup" element={<SignupOptionsPage />} />
      <Route path="/signup/email" element={<SignupPage />} />
      <Route path="/signup/resend" element={<ResendConfirmationPage />} />
      <Route path="/signup/confirm/:token" element={<SignupConfirmPage />} />
      <Route path="/signup/complete" element={<OAuthSignupPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path="/password-reset/:token" element={<PasswordResetConfirmPage />} />
      <Route element={<AppLayout />}>
        <Route path="/play" caseSensitive element={<GoHomePage />} />
        <Route path="/play/local" caseSensitive element={<LocalPlayPage />} />
        <Route
          path="/play/local/setup"
          caseSensitive
          element={<GameSetupPage key="local" mode="local" />}
        />
        <Route
          path="/play/online/setup"
          caseSensitive
          element={<GameSetupPage key="online" mode="online" />}
        />
        <Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
      </Route>
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  )
}
