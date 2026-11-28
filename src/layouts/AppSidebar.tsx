import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { StoneMark } from "@/components/ui/StoneMark";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import friends from "@/assets/icons/account/friends.svg";
import messages from "@/assets/icons/account/messages.svg";
import notifications from "@/assets/icons/account/notifications.svg";
import grid from "@/assets/icons/nav/grid.svg";
import navPuzzle from "@/assets/icons/nav/nav-puzzle.svg";
import navBook from "@/assets/icons/nav/nav-book.svg";
import guideArrow from "@/assets/icons/nav/guide-arrow.svg";
import divider from "@/assets/icons/nav/divider.svg";
import { SidebarSettingsMenu } from "./SidebarSettingsMenu";

type AppSidebarProps = {
	compact: boolean;
	onNavigate: () => void;
	onNotice: (label: string) => void;
};

const comingSoonLinks = [
	{ label: "account.friends", icon: friends },
	{ label: "account.messages", icon: messages },
	{ label: "account.notifications", icon: notifications },
] as const;

function SidebarAccount({ onNavigate, onNotice }: Omit<AppSidebarProps, "compact">) {
	const { t } = useTranslation(["nav", "common"]);
	const { account } = useAuth();
	if (account === undefined) return null;
	if (account === null)
		return (
			<div className="go-sidebar-auth">
				<Link className="go-sign-in" to="/login" onClick={() => onNavigate()}>
					{t("common:actions.login")}
				</Link>
				<Link className="go-sign-up" to="/signup" onClick={() => onNavigate()}>
					{t("common:actions.signUp")}
				</Link>
				<LanguagePicker className="language-button go-sidebar-language" />
			</div>
		);

	return (
		<div className="go-sidebar-account">
			<NavLink className="go-sidebar-account__profile" to={`/member/${account.username}`} onClick={() => onNavigate()}>
				<span className="go-sidebar-account__avatar">
					<StoneMark style="polished" size={20} />
				</span>
				<span className="go-sidebar-account__name">{account.username}</span>
			</NavLink>
			<nav className="go-sidebar-account__icons" aria-label={t("account.label")}>
				{comingSoonLinks.map((link) => (
					<button
						key={link.label}
						type="button"
						aria-label={t(link.label)}
						title={t(link.label)}
						onClick={() => onNotice(t(link.label))}
					>
						<img src={link.icon} alt="" />
					</button>
				))}
				<SidebarSettingsMenu onNavigate={onNavigate} />
			</nav>
		</div>
	);
}

export function AppSidebar({ compact, onNavigate, onNotice }: AppSidebarProps) {
	const { t } = useTranslation(["nav", "common"]);
	return (
		<aside className="go-sidebar" aria-label={t("navigation")}>
			<div className="go-sidebar__primary">
				{compact && (
					<button className="go-sidebar-close" onClick={() => onNavigate()} aria-label={t("drawer.close")}>
						×
					</button>
				)}
				<Link to="/" className="go-brand" aria-label={t("common:homeLink")}>
					<StoneMark style="polished" size={34} />
					<span>{t("common:brand")}</span>
				</Link>
				<nav className="go-sections" aria-label={t("mainNavigation")}>
					<NavLink to="/play" onClick={() => onNavigate()}>
						<img src={grid} alt="" />
						<span>{t("play")}</span>
					</NavLink>
					<button onClick={() => onNotice(t("puzzles"))}>
						<img src={navPuzzle} alt="" />
						<span>{t("puzzles")}</span>
					</button>
					<button onClick={() => onNotice(t("learn"))}>
						<img src={navBook} alt="" />
						<span>{t("learn")}</span>
					</button>
				</nav>
			</div>
			<div className="go-utilities">
				<div className="go-guide">
					<p>{t("guide.heading")}</p>
					<button onClick={() => onNotice(t("guide.startWithBasics"))}>
						{t("guide.startWithBasics")}
						<img className="directional-icon" src={guideArrow} alt="" />
					</button>
				</div>
				<img className="go-utility-divider" src={divider} alt="" />
				<SidebarAccount onNavigate={onNavigate} onNotice={onNotice} />
			</div>
		</aside>
	);
}
