import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "../../auth/api";
import { useAppLayout } from "../../components/layout/useAppLayout";
import { mockPreferences, mockProfile } from "./settingsMock";
import type { SettingsContext } from "./useSettings";
import settingsIcon from "../../assets/go-home/settings.svg";
import boardIcon from "../../assets/account/board.svg";
import gameplayIcon from "../../assets/account/gameplay.svg";
import profileIcon from "../../assets/account/profile.svg";
import friendsIcon from "../../assets/account/friends.svg";
import accountIcon from "../../assets/account/account.svg";
import "./SettingsPages.css";

const sections = [
	{ path: "board", label: "Board & Stones", icon: boardIcon },
	{ path: "gameplay", label: "Gameplay", icon: gameplayIcon },
	{ path: "profile", label: "Profile", icon: profileIcon },
	{ path: "social", label: "Social & Privacy", icon: friendsIcon },
	{ path: "account", label: "Account & Security", icon: accountIcon },
];

export default function SettingsLayout() {
	const { account, accountError, reloadAccount } = useAuth();
	const { comingSoon } = useAppLayout();
	const location = useLocation();
	const [preferences, setPreferences] = useState(mockPreferences);
	const [profile, setProfile] = useState(mockProfile);
	const currentSection = sections.find((section) => location.pathname === `/settings/${section.path}`);

	useEffect(() => {
		document.title = currentSection ? `Baduk — ${currentSection.label} settings` : "Baduk — Settings";
	}, [currentSection]);

	if (account === null) return <Navigate to="/login" replace />;

	return (
		<main className="settings" id="main-content">
			<header className="settings__header">
				<img src={settingsIcon} alt="" width={26} height={26} />
				<h1>Settings</h1>
			</header>
			{accountError ? (
				<div className="settings__session" role="alert">
					<p>{accountError}</p>
					<button type="button" className="settings-button" onClick={() => void reloadAccount()}>
						Retry
					</button>
				</div>
			) : account === undefined ? (
				<p className="settings__session" role="status">
					Checking your session…
				</p>
			) : (
				<div className="settings__panel">
					<nav className="settings__nav" aria-label="Settings sections">
						{sections.map((section) => (
							<NavLink key={section.path} to={section.path}>
								<img src={section.icon} alt="" />
								<span>{section.label}</span>
							</NavLink>
						))}
					</nav>
					<div className="settings__content">
						<Outlet
							context={
								{
									account,
									preferences,
									setPreferences,
									profile,
									setProfile,
									comingSoon,
								} satisfies SettingsContext
							}
						/>
					</div>
				</div>
			)}
		</main>
	);
}
