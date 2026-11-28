import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useAppLayout } from "@/hooks/useAppLayout";
import { usePreferences } from "@/hooks/usePreferences";
import { mockProfile } from "@/data/mocks/settings";
import type { SettingsContext } from "@/context/SettingsContext";
import settingsIcon from "@/assets/icons/account/settings.svg";
import boardIcon from "@/assets/icons/account/board.svg";
import gameplayIcon from "@/assets/icons/account/gameplay.svg";
import profileIcon from "@/assets/icons/account/profile.svg";
import friendsIcon from "@/assets/icons/account/friends.svg";
import accountIcon from "@/assets/icons/account/account.svg";
import languageIcon from "@/assets/icons/account/language.svg";
import "@/styles/settings.css";

const sections = [
	{ path: "board", icon: boardIcon },
	{ path: "gameplay", icon: gameplayIcon },
	{ path: "profile", icon: profileIcon },
	{ path: "social", icon: friendsIcon },
	{ path: "account", icon: accountIcon },
	{ path: "language", icon: languageIcon },
] as const;

export default function SettingsLayout() {
	const { t } = useTranslation(["settings", "common"]);
	const { account, accountError, reloadAccount } = useAuth();
	const { comingSoon } = useAppLayout();
	const location = useLocation();
	const { preferences, setPreferences } = usePreferences();
	const [profile, setProfile] = useState(mockProfile);
	const currentSection = sections.find((section) => location.pathname === `/settings/${section.path}`);

	useEffect(() => {
		const title = currentSection
			? t("header.sectionTitle", { section: t(`sections.${currentSection.path}`) })
			: t("header.title");
		document.title = t("common:pageTitle", { title });
	}, [currentSection, t]);

	if (account === null) return <Navigate to="/login" replace />;

	return (
		<main className="settings" id="main-content">
			<header className="settings__header">
				<img src={settingsIcon} alt="" width={26} height={26} />
				<h1>{t("header.title")}</h1>
			</header>
			{accountError ? (
				<div className="settings__session" role="alert">
					<p>{accountError}</p>
					<button type="button" className="settings-button" onClick={() => void reloadAccount()}>
						{t("common:actions.retry")}
					</button>
				</div>
			) : account === undefined ? (
				<p className="settings__session" role="status">
					{t("common:status.checkingSession")}
				</p>
			) : (
				<div className="settings__panel">
					<nav className="settings__nav" aria-label={t("header.navLabel")}>
						{sections.map((section) => (
							<NavLink key={section.path} to={section.path}>
								<img src={section.icon} alt="" />
								<span>{t(`sections.${section.path}`)}</span>
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
