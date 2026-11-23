import { AppLayout } from "./components/layout/AppLayout";
import { Route, Routes } from "react-router";
import MaterialLibraryPage from "./pages/material-library/MaterialLibraryPage";
import WelcomePage from "./pages/welcome/WelcomePage";
import GoHomePage from "./pages/play/GoHomePage";
import LocalPlayPage from "./pages/play/LocalPlayPage";
import GameSetupPage from "./pages/setup/GameSetupPage";
import {
	LoginPage,
	OAuthSignupPage,
	PasswordResetConfirmPage,
	PasswordResetPage,
	ResendConfirmationPage,
	SignupConfirmPage,
	SignupOptionsPage,
	SignupPage,
	TwoFactorLoginPage,
} from "./pages/auth/AuthPages";

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
				<Route path="/play/local/setup" caseSensitive element={<GameSetupPage key="local" mode="local" />} />
				<Route path="/play/online/setup" caseSensitive element={<GameSetupPage key="online" mode="online" />} />
				<Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
			</Route>
			<Route path="*" element={<WelcomePage />} />
		</Routes>
	);
}
