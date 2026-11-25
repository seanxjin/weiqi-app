import { Link, NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { StoneMark } from "@/components/ui/StoneMark";
import friends from "@/assets/icons/account/friends.svg";
import messages from "@/assets/icons/account/messages.svg";
import notifications from "@/assets/icons/account/notifications.svg";
import grid from "@/assets/icons/nav/grid.svg";
import navPuzzle from "@/assets/icons/nav/nav-puzzle.svg";
import navBook from "@/assets/icons/nav/nav-book.svg";
import guideArrow from "@/assets/icons/nav/guide-arrow.svg";
import divider from "@/assets/icons/nav/divider.svg";
import settings from "@/assets/icons/account/settings.svg";

type AppSidebarProps = {
	compact: boolean;
	onNavigate: () => void;
	onNotice: (label: string) => void;
};

const comingSoonLinks = [
	{ label: "Friends", icon: friends },
	{ label: "Messages", icon: messages },
	{ label: "Notifications", icon: notifications },
];

function SidebarAccount({ onNavigate, onNotice }: Omit<AppSidebarProps, "compact">) {
	const { account } = useAuth();
	if (account === undefined) return null;
	if (account === null)
		return (
			<Link className="go-sign-in" to="/login" onClick={() => onNavigate()}>
				Sign in
			</Link>
		);

	return (
		<div className="go-sidebar-account">
			<NavLink className="go-sidebar-account__profile" to={`/member/${account.username}`} onClick={() => onNavigate()}>
				<span className="go-sidebar-account__avatar">
					<StoneMark style="polished" size={20} />
				</span>
				<span className="go-sidebar-account__name">{account.username}</span>
			</NavLink>
			<nav className="go-sidebar-account__icons" aria-label="Account">
				{comingSoonLinks.map((link) => (
					<button
						key={link.label}
						type="button"
						aria-label={link.label}
						title={link.label}
						onClick={() => onNotice(link.label)}
					>
						<img src={link.icon} alt="" />
					</button>
				))}
				<NavLink to="/settings" aria-label="Settings" title="Settings" onClick={() => onNavigate()}>
					<img src={settings} alt="" />
				</NavLink>
			</nav>
		</div>
	);
}

export function AppSidebar({ compact, onNavigate, onNotice }: AppSidebarProps) {
	return (
		<aside className="go-sidebar" aria-label="Baduk navigation">
			<div className="go-sidebar__primary">
				{compact && (
					<button className="go-sidebar-close" onClick={() => onNavigate()} aria-label="Close navigation">
						×
					</button>
				)}
				<Link to="/" className="go-brand" aria-label="Baduk home">
					<StoneMark style="polished" size={34} />
					<span>BADUK</span>
				</Link>
				<nav className="go-sections" aria-label="Main navigation">
					<NavLink to="/play" onClick={() => onNavigate()}>
						<img src={grid} alt="" />
						<span>Play</span>
					</NavLink>
					<button onClick={() => onNotice("Puzzles")}>
						<img src={navPuzzle} alt="" />
						<span>Puzzles</span>
					</button>
					<button onClick={() => onNotice("Learn")}>
						<img src={navBook} alt="" />
						<span>Learn</span>
					</button>
				</nav>
			</div>
			<div className="go-utilities">
				<div className="go-guide">
					<p>NEW TO GO?</p>
					<button onClick={() => onNotice("Start with the basics")}>
						Start with the basics
						<img src={guideArrow} alt="" />
					</button>
				</div>
				<img className="go-utility-divider" src={divider} alt="" />
				<SidebarAccount onNavigate={onNavigate} onNotice={onNotice} />
			</div>
		</aside>
	);
}
