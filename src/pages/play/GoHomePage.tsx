import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import signinArrow from "@/assets/icons/home/signin-arrow.svg";
import globe from "@/assets/icons/home/globe.svg";
import local from "@/assets/icons/home/local.svg";
import localArrow from "@/assets/icons/common/local-arrow.svg";
import users from "@/assets/icons/home/users.svg";
import friendArrow from "@/assets/icons/home/friend-arrow.svg";
import puzzle from "@/assets/icons/home/puzzle.svg";
import book from "@/assets/icons/home/book.svg";
import lessonArrow from "@/assets/icons/home/lesson-arrow.svg";
import bot from "@/assets/icons/home/bot.svg";
import presence from "@/assets/icons/home/presence.svg";
import { useAppLayout } from "@/hooks/useAppLayout";
import { useAuth } from "@/hooks/useAuth";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import "@/styles/play.css";

interface PlayOption {
	id: "online" | "local" | "friend" | "puzzles" | "lessons" | "bots";
	icon: string;
	arrow: string;
	primary?: boolean;
	to?: string;
}

const options: PlayOption[] = [
	{ id: "online", icon: globe, arrow: localArrow, primary: true, to: "/play/online/setup" },
	{ id: "local", icon: local, arrow: localArrow, to: "/play/local/setup" },
	{ id: "friend", icon: users, arrow: friendArrow },
	{ id: "puzzles", icon: puzzle, arrow: friendArrow },
	{ id: "lessons", icon: book, arrow: lessonArrow },
	{ id: "bots", icon: bot, arrow: lessonArrow },
];

const playersOnline = 1248;

export default function GoHomePage() {
	const { t } = useTranslation(["play", "common"]);
	const { comingSoon } = useAppLayout();
	const { account, accountError, reloadAccount, logout } = useAuth();
	const [loggingOut, setLoggingOut] = useState(false);
	const [logoutError, setLogoutError] = useState<string | null>(null);
	const navigate = useNavigate();
	const signOut = async () => {
		if (loggingOut) return;
		setLoggingOut(true);
		setLogoutError(null);
		try {
			await logout();
		} catch {
			setLogoutError(t("play:home.logoutError"));
		} finally {
			setLoggingOut(false);
		}
	};
	useEffect(() => {
		document.title = t("common:pageTitle", { title: t("play:home.pageTitle") });
	}, [t]);

	return (
		<div className="go-home" data-node-id="46:381">
			<main className="go-content" id="main-content">
				<header className="go-topbar">
					<div className="go-location">
						<p>{t("play:home.location")}</p>
					</div>
					<div className="go-account">
						{accountError ? (
							<>
								<span role="status">{accountError}</span>
								<button onClick={() => void reloadAccount()}>{t("common:actions.retry")}</button>
							</>
						) : account === undefined ? (
							<span role="status">{t("common:status.checkingSession")}</span>
						) : account ? (
							<>
								<span>{t("play:home.signedInAs", { username: account.username })}</span>
								<button onClick={signOut} disabled={loggingOut}>
									{loggingOut ? t("common:actions.loggingOut") : t("common:actions.logOut")}
								</button>
							</>
						) : (
							<>
								<span>{t("play:home.guest")}</span>
								<button onClick={() => navigate("/login")}>
									{t("common:actions.signIn")}
									<img className="directional-icon" src={signinArrow} alt="" />
								</button>
							</>
						)}
					</div>
				</header>
				{logoutError && (
					<p className="go-account-error" role="alert">
						{logoutError}
					</p>
				)}
				<section className="go-introduction" aria-labelledby="go-heading">
					<h1 id="go-heading">{t("play:home.introduction.heading")}</h1>
					<p>{t("play:home.introduction.body")}</p>
				</section>
				<section className="go-workspace" aria-labelledby="go-menu-heading">
					<h2 id="go-menu-heading" className="go-label">
						{t("play:home.menuHeading")}
					</h2>
					<div className="go-menu">
						{options.map((option) => {
							const label = t(`play:home.options.${option.id}.label`);
							const content = (
								<>
									<img src={option.icon} alt="" />
									<span className="go-option__details">
										<span className="go-option__label">{label}</span>
										<span className="go-option__description">{t(`play:home.options.${option.id}.description`)}</span>
									</span>
									<span className="go-option__arrow">
										<img className="directional-icon" src={option.arrow} alt="" />
									</span>
								</>
							);
							return option.to ? (
								<Link
									key={option.id}
									to={option.to}
									className={`go-option${option.primary ? " go-option--primary" : ""}`}
								>
									{content}
								</Link>
							) : (
								<button
									key={option.id}
									onClick={() => comingSoon(label)}
									className={`go-option${option.primary ? " go-option--primary" : ""}`}
								>
									{content}
								</button>
							);
						})}
					</div>
					<p className="go-presence">
						<img src={presence} alt="" />
						{t("play:home.presence", { count: playersOnline })}
					</p>
				</section>
				<section className="go-reserved" aria-labelledby="go-reserved-heading">
					<h2 id="go-reserved-heading" className="go-label">
						{t("play:home.reserved.label")}
					</h2>
					<div>
						<h3>{t("play:home.reserved.heading")}</h3>
						<p>{t("play:home.reserved.body")}</p>
					</div>
				</section>
				<footer className="go-footer">
					<p>{t("play:home.footerTagline")}</p>
					<LanguagePicker />
				</footer>
			</main>
		</div>
	);
}
