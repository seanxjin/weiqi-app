import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
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
import MaterialLibraryPage from "./pages/material-library/MaterialLibraryPage";
import GoHomePage from "./pages/play/GoHomePage";
import LocalPlayPage from "./pages/play/LocalPlayPage";
import OnlinePlayPage from "./pages/play/online/OnlinePlayPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import BoardSettingsPage from "./pages/settings/BoardSettingsPage";
import GameplaySettingsPage from "./pages/settings/GameplaySettingsPage";
import ProfileSettingsPage from "./pages/settings/ProfileSettingsPage";
import SettingsLayout from "./pages/settings/SettingsLayout";
import SocialSettingsPage from "./pages/settings/SocialSettingsPage";
import GameSetupPage from "./pages/setup/GameSetupPage";
import WelcomePage from "./pages/welcome/WelcomePage";

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
				<Route path="/play/online/:gameId" caseSensitive element={<OnlinePlayPage />} />
				<Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
				<Route path="/member/:username" element={<ProfilePage />} />
				<Route path="/settings" element={<SettingsLayout />}>
					<Route index element={<Navigate to="board" replace />} />
					<Route path="board" element={<BoardSettingsPage />} />
					<Route path="gameplay" element={<GameplaySettingsPage />} />
					<Route path="profile" element={<ProfileSettingsPage />} />
					<Route path="social" element={<SocialSettingsPage />} />
					<Route path="account" element={<AccountSettingsPage />} />
				</Route>
			</Route>
			<Route path="*" element={<WelcomePage />} />
		</Routes>
	);
}
